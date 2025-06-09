import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseService } from '../../common/base/base.service'

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super('UserService');
  }

  async findById(id: string): Promise<User> {
    this.logMethodCall('findById', { id });
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        this.logError('findById', new NotFoundException(`User with ID ${id} not found`));
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logMethodResult('findById', { userId: user.id });
      return user;
    } catch (error) {
      this.logError('findById', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logMethodCall('findByEmail', { email });
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      this.logMethodResult('findByEmail', user ? { userId: user.id } : null);
      return user;
    } catch (error) {
      this.logError('findByEmail', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    this.logMethodCall('findAll');
    try {
      const users = await this.userRepository.find();
      this.logMethodResult('findAll', { count: users.length });
      return users;
    } catch (error) {
      this.logError('findAll', error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    this.logMethodCall('update', { id, updateData });
    try {
      const user = await this.findById(id);
      Object.assign(user, updateData);
      const updatedUser = await this.userRepository.save(user);
      this.logMethodResult('update', { userId: updatedUser.id });
      return updatedUser;
    } catch (error) {
      this.logError('update', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    this.logMethodCall('delete', { id });
    try {
      const user = await this.findById(id);
      await this.userRepository.remove(user);
      this.logMethodResult('delete', { userId: id });
    } catch (error) {
      this.logError('delete', error);
      throw error;
    }
  }
} 