import { Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../../api/user/auth/guards/jwt-auth.guard';

@Injectable()
export class UserGuard extends JwtAuthGuard {} 