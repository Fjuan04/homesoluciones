import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

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

  async createStat(dto: CreateStatDto) {
    return this.prisma.stat.create({ data: dto });
  }

  async updateStat(id: number, dto: UpdateStatDto) {
    const stat = await this.prisma.stat.findUnique({ where: { id } });
    if (!stat) throw new NotFoundException(`Estadística #${id} no encontrada`);
    return this.prisma.stat.update({ where: { id }, data: dto });
  }

  async deleteStat(id: number) {
    const stat = await this.prisma.stat.findUnique({ where: { id } });
    if (!stat) throw new NotFoundException(`Estadística #${id} no encontrada`);
    return this.prisma.stat.delete({ where: { id } });
  }

  async getProjects() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFeaturedProject() {
    const featured = await this.prisma.project.findFirst({
      where: { isFeatured: true },
      orderBy: { updatedAt: 'desc' }, // Si hay varios, toma el más recientemente actualizado
    });
    if (!featured) {
      // Retorna el más reciente si no hay ninguno marcado
      return this.prisma.project.findFirst({ orderBy: { createdAt: 'desc' } });
    }
    return featured;
  }

  async createProject(dto: CreateProjectDto) {
    // Si se marca como featured, desmarcar los demás
    if (dto.isFeatured) {
      await this.prisma.project.updateMany({ data: { isFeatured: false } });
    }
    return this.prisma.project.create({ data: dto });
  }

  async updateProject(id: number, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Proyecto #${id} no encontrado`);

    // Si se marca como featured, desmarcar los demás primero
    if (dto.isFeatured) {
      await this.prisma.project.updateMany({
        where: { id: { not: id } },
        data: { isFeatured: false },
      });
    }
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async deleteProject(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Proyecto #${id} no encontrado`);
    return this.prisma.project.delete({ where: { id } });
  }

  async getProcessSteps() {
    return this.prisma.processStep.findMany({
      orderBy: { num: 'asc' },
    });
  }

  async getBlogPosts() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  }
}
