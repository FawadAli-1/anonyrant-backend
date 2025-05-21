import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class SearchRantsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ReactionType)
  reactionType?: ReactionType;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'reactions' | 'comments';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  skip?: string;

  @IsOptional()
  @IsString()
  take?: string;
}
