import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReactionType } from '@prisma/client';

@Injectable()
export class ReactionsService {
  constructor(private prisma: PrismaService) {}

  private getTodayRange() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(4, 0, 0, 0); // Set to 4 AM today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // 4 AM tomorrow

    return { today, tomorrow };
  }

  async toggleReaction(data: {
    type: ReactionType;
    anonymousId: string;
    rantId: string;
  }) {
    const { today, tomorrow } = this.getTodayRange();

    // First check if the rant exists and is from today
    const rant = await this.prisma.rant.findFirst({
      where: {
        id: data.rantId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (!rant) {
      throw new NotFoundException('Rant not found');
    }

    // Check if reaction already exists from today
    const existingReaction = await this.prisma.reaction.findFirst({
      where: {
        type: data.type,
        anonymousId: data.anonymousId,
        rantId: data.rantId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingReaction) {
      // If reaction exists, remove it
      return this.prisma.reaction.delete({
        where: { id: existingReaction.id },
      });
    } else {
      // If reaction doesn't exist, create it
      return this.prisma.reaction.create({
        data: {
          type: data.type,
          anonymousId: data.anonymousId,
          rant: {
            connect: { id: data.rantId },
          },
        },
      });
    }
  }

  async getReactionsByRantId(rantId: string) {
    const { today, tomorrow } = this.getTodayRange();

    return this.prisma.reaction.groupBy({
      by: ['type'],
      where: {
        rantId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _count: true,
    });
  }
}
