import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { ProfileResponse } from './interfaces/profile-response.interface';
import { compareSync, hash } from 'bcryptjs';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(token: string): Promise<ProfileResponse> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return plainToClass(ProfileResponse, user);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid token');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const passwordIsValid = compareSync(loginDto.password, user.password);
    if (!passwordIsValid) {
      throw new ForbiddenException('Invalid password');
    }

    const payload: JwtPayload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
    };
  }

  async register(registerDto: RegisterDto): Promise<ProfileResponse> {
    await this.ensureEmailNotExists(registerDto.email);

    const hashedPassword = await hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
    });

    return plainToClass(ProfileResponse, user);
  }

  async refreshToken(
    refresh_token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(refresh_token);
      const user = await this.findUserByEmailOrThrow(decoded.email);

      const payload: JwtPayload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid refresh token');
    }
  }

  private async ensureEmailNotExists(email: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ForbiddenException('Email already exists');
    }
  }

  private async findUserByEmailOrThrow(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    return user;
  }
}
