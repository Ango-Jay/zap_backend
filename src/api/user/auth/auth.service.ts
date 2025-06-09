import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { BaseService } from '../../../common/base/base.service';

@Injectable()
export class AuthService extends BaseService {
  private readonly authLogger: Logger;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super('AuthService');
    this.authLogger = new Logger('AuthService');
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logMethodCall('validateUser', { email });
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user && await bcrypt.compare(password, user.passwordHash)) {
        this.logMethodResult('validateUser', { userId: user.id });
        return user;
      }
      this.logMethodResult('validateUser', null);
      return null;
    } catch (error) {
      this.logError('validateUser', error);
      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    this.logMethodCall('hashPassword', { passwordLength: password?.length });
    
    if (!password) {
      const error = new Error('Password is required');
      this.logError('hashPassword', error);
      throw error;
    }

    try {
      const saltRounds = 10;
      this.authLogger.debug(`Generating salt with ${saltRounds} rounds`);
      
      const salt = await bcrypt.genSalt(saltRounds);
      this.authLogger.debug(`Generated salt: ${salt}`);
      
      this.authLogger.debug(`Hashing password with salt`);
      const hash = await bcrypt.hash(password, salt);
      this.authLogger.debug(`Generated hash: ${hash}`);
      
      this.logMethodResult('hashPassword', { hashLength: hash.length });
      return hash;
    } catch (error) {
      this.logError('hashPassword', error);
      throw error;
    }
  }

  async generateToken(user: User): Promise<string> {
    this.logMethodCall('generateToken', { userId: user.id });
    try {
      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);
      this.logMethodResult('generateToken', { token });
      return token;
    } catch (error) {
      this.logError('generateToken', error);
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    this.logMethodCall('createUser', { 
      ...createUserDto,
      password: createUserDto.password ? '[REDACTED]' : undefined 
    });
    
    try {
      if (!createUserDto.password) {
        const error = new Error('Password is required');
        this.logError('createUser', error);
        throw error;
      }

      const { password, ...userData } = createUserDto;
      this.authLogger.debug('Password extracted from DTO');
      
      const passwordHash = await this.hashPassword(password);
      this.authLogger.debug('Password hashed successfully');
      
      const user = this.userRepository.create({
        ...userData,
        passwordHash,
      });
      this.authLogger.debug('User entity created');
      
      const savedUser = await this.userRepository.save(user);
      this.logMethodResult('createUser', { userId: savedUser.id });

      // Return user without passwordHash
      const { passwordHash: _, ...sanitizedUser } = savedUser;
      return sanitizedUser;
    } catch (error) {
      this.logError('createUser', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: Omit<User, 'passwordHash'> }> {
    this.logMethodCall('login', { email: loginDto.email });
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        this.logError('login', new UnauthorizedException('Invalid credentials'));
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.generateToken(user);
      this.logMethodResult('login', { userId: user.id });

      // Return token and user without passwordHash
      const { passwordHash: _, ...sanitizedUser } = user;
      return {
        access_token: token,
        user: sanitizedUser
      };
    } catch (error) {
      this.logError('login', error);
      throw error;
    }
  }
} 