import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponse } from './interfaces/login-response.interface';
import { ProfileResponse } from './interfaces/profile-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ProfileResponse> {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  async refresh(
    @Body() body: { refresh_token: string },
  ): Promise<{ access_token: string }> {
    return this.authService.refreshToken(body.refresh_token);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any): Promise<ProfileResponse> {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();

    return this.authService.validateUser(token);
  }
}
