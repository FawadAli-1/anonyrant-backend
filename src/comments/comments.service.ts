import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  private getTodayRange() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(4, 0, 0, 0); // Set to 4 AM today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // 4 AM tomorrow

    return { today, tomorrow };
  }

  async create(data: {
    content: string;
    anonymousId: string;
    rant: {
      connect: {
        id: string;
      };
    };
  }) {
    // First check if the rant exists and is from today
    const { today, tomorrow } = this.getTodayRange();
    const rant = await this.prisma.rant.findFirst({
      where: { 
        id: data.rant.connect.id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        }
      },
    });

    if (!rant) {
      throw new NotFoundException('Rant not found');
    }

    return this.prisma.comment.create({
      data: {
        content: data.content,
        anonymousId: data.anonymousId,
        rant: {
          connect: { id: data.rant.connect.id }
        }
      },
      include: {
        rant: true,
      },
    });
  }

  async findByRantId(rantId: string, skip = 0, take = 20) {
    const { today, tomorrow } = this.getTodayRange();

    return this.prisma.comment.findMany({
      where: {
        rantId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        }
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(id: string, anonymousId: string) {
    const { today, tomorrow } = this.getTodayRange();

    const comment = await this.prisma.comment.findFirst({
      where: { 
        id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        }
      },
    });

    if (!comment || comment.anonymousId !== anonymousId) {
      return null;
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
} 