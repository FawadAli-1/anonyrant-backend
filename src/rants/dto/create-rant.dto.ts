import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRantDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Title cannot be longer than 100 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Content must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Content cannot be longer than 1000 characters' })
  content: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Anonymous ID must be at least 5 characters long' })
  anonymousId: string;
} 