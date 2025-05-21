import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  @IsNotEmpty()
  type: ReactionType;

  @IsString()
  @IsNotEmpty()
  anonymousId: string;

  @IsString()
  @IsNotEmpty()
  rantId: string;
} 