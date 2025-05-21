import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateRantDto } from './dto/create-rant.dto';
import { SearchRantsDto } from './dto/search-rants.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RantsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Clean up old data when the server starts
    await this.cleanupOldData();
  }

  @Cron('0 0 4 * * *') // Run at 4 AM every day
  async cleanupOldData() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(4, 0, 0, 0); // Set to 4 AM yesterday

    await this.prisma.rant.deleteMany({
      where: {
        createdAt: {
          lt: yesterday,
        },
      },
    });
  }

  private getTodayRange() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(4, 0, 0, 0); // Set to 4 AM today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // 4 AM tomorrow

    return { today, tomorrow };
  }

  async create(data: Prisma.RantCreateInput) {
    return this.prisma.rant.create({
      data,
      include: {
        reactions: true,
        comments: true,
      },
    });
  }

  async findAll(params: SearchRantsDto) {
    const {
      search,
      reactionType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      skip = '0',
      take = '10',
    } = params;

    const { today, tomorrow } = this.getTodayRange();

    // Base query
    const where: Prisma.RantWhereInput = {
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    };

    // Add search condition if search term is provided
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add reaction type filter if provided
    if (reactionType) {
      where.reactions = {
        some: {
          type: reactionType,
        },
      };
    }

    // Build orderBy based on sortBy parameter
    let orderBy: Prisma.RantOrderByWithRelationInput = {};

    switch (sortBy) {
      case 'reactions':
        orderBy = {
          reactions: {
            _count: sortOrder,
          },
        };
        break;
      case 'comments':
        orderBy = {
          comments: {
            _count: sortOrder,
          },
        };
        break;
      default:
        orderBy = {
          createdAt: sortOrder as Prisma.SortOrder,
        };
    }

    return this.prisma.rant.findMany({
      where,
      orderBy,
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        reactions: true,
        comments: true,
      },
    });
  }

  async findOne(id: string) {
    const { today, tomorrow } = this.getTodayRange();

    return this.prisma.rant.findFirst({
      where: {
        id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        reactions: true,
        comments: true,
      },
    });
  }

  async findRandom() {
    const { today, tomorrow } = this.getTodayRange();

    // Get total count of today's rants
    const count = await this.prisma.rant.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // If no rants exist, return null
    if (count === 0) {
      return null;
    }

    // Generate random skip value
    const skip = Math.floor(Math.random() * count);

    // Get random rant
    const [rant] = await this.prisma.rant.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      take: 1,
      skip,
      include: {
        reactions: true,
        comments: true,
      },
    });

    return rant;
  }

  async delete(id: string, anonymousId: string) {
    const { today, tomorrow } = this.getTodayRange();

    const rant = await this.prisma.rant.findFirst({
      where: {
        id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (!rant || rant.anonymousId !== anonymousId) {
      return null;
    }

    return this.prisma.rant.delete({
      where: { id },
    });
  }
}
