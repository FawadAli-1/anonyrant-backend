import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Comment must not be empty' })
  @MaxLength(500, { message: 'Comment cannot be longer than 500 characters' })
  content: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Anonymous ID must be at least 5 characters long' })
  anonymousId: string;

  @IsString()
  @IsNotEmpty()
  rantId: string;
}
