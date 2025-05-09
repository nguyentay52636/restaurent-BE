import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsInt()
  roleId?: number;
}
