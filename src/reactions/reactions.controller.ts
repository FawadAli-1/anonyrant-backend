import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  toggleReaction(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionsService.toggleReaction(createReactionDto);
  }

  @Get('rant/:rantId')
  getReactionsByRantId(@Param('rantId') rantId: string) {
    return this.reactionsService.getReactionsByRantId(rantId);
  }
} 