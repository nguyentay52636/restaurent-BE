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
      throw new ForbiddenException('Email không tồn tại.');
    }

    const isPasswordValid = compareSync(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Mật khẩu không đúng.');
    }

    const payload: JwtPayload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      user: plainToClass(ProfileResponse, user, {
        excludeExtraneousValues: true,
      }),
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<ProfileResponse> {
    await this.ensureEmailNotExists(registerDto.email);

    const hashedPassword = await hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return plainToClass(ProfileResponse, user);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(refreshToken);
      const user = await this.findUserByEmailOrThrow(decoded.email);

      const payload: JwtPayload = { email: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload, { expiresIn: '1s' }),
        refreshToken,
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
