import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    const { rantId, ...data } = createCommentDto;
    return this.commentsService.create({
      ...data,
      rant: {
        connect: { id: rantId },
      },
    });
  }

  @Get('rant/:rantId')
  findByRantId(
    @Param('rantId') rantId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const { skip = 0, take = 20 } = paginationQuery;
    return this.commentsService.findByRantId(rantId, skip, take);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query('anonymousId') anonymousId: string,
  ) {
    if (!anonymousId) {
      throw new ForbiddenException('Anonymous ID is required');
    }

    const result = await this.commentsService.delete(id, anonymousId);
    if (!result) {
      throw new NotFoundException(
        'Comment not found or you are not authorized to delete it',
      );
    }
    return result;
  }
}
