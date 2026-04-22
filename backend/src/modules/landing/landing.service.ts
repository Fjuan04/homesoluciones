import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LandingService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    return this.prisma.stat.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async getServices() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async getProjects() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProcessSteps() {
    return this.prisma.processStep.findMany({
      orderBy: { num: 'asc' },
    });
  }

  async getBlogPosts() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3, // Landing solo muestra los 3 más recientes
    });
  }
}
