import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateTableDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  seats: number;
}
