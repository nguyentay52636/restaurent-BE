import {
  IsString,
  IsInt,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class ProfileResponse {
  @IsInt()
  id: number;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Expose()
  fullName: string;

  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @IsOptional()
  @Exclude()
  password: string;

  @IsString()
  @Expose()
  phone: string;

  @IsString()
  @Expose()
  address: string;

  @IsInt()
  @Expose()
  roleId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
