import { Controller, Get, Post, Body, Param, Delete, Query, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RantsService } from './rants.service';
import { CreateRantDto } from './dto/create-rant.dto';
import { SearchRantsDto } from './dto/search-rants.dto';

@Controller('rants')
export class RantsController {
  constructor(private readonly rantsService: RantsService) {}

  @Post()
  create(@Body() createRantDto: CreateRantDto) {
    return this.rantsService.create(createRantDto);
  }

  @Get()
  findAll(@Query() searchParams: SearchRantsDto) {
    return this.rantsService.findAll(searchParams);
  }

  @Get('random')
  async findRandom() {
    const rant = await this.rantsService.findRandom();
    if (!rant) {
      throw new NotFoundException('No rants found');
    }
    return rant;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rant = await this.rantsService.findOne(id);
    if (!rant) {
      throw new NotFoundException('Rant not found');
    }
    return rant;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Query('anonymousId') anonymousId: string) {
    if (!anonymousId) {
      throw new ForbiddenException('Anonymous ID is required');
    }

    const result = await this.rantsService.delete(id, anonymousId);
    if (!result) {
      throw new NotFoundException('Rant not found or you are not authorized to delete it');
    }
    return result;
  }
} 