import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LandingService } from './landing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Controller()
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  // ─── LECTURA PÚBLICA (para el frontend Astro) ─────────────────────────────

  @Get('stats')
  getStats() {
    return this.landingService.getStats();
  }

  @Get('services')
  getServices() {
    return this.landingService.getServices();
  }

  @Get('projects')
  getProjects() {
    return this.landingService.getProjects();
  }

  @Get('projects/featured')
  getFeaturedProject() {
    return this.landingService.getFeaturedProject();
  }

  @Get('process-steps')
  getProcessSteps() {
    return this.landingService.getProcessSteps();
  }

  @Get('blog/latest')
  getBlogPosts() {
    return this.landingService.getBlogPosts();
  }

  // ─── CRUD PROTEGIDO (solo desde el CMS con JWT) ────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('stats')
  createStat(@Body() dto: CreateStatDto) {
    return this.landingService.createStat(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('stats/:id')
  updateStat(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatDto) {
    return this.landingService.updateStat(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('stats/:id')
  deleteStat(@Param('id', ParseIntPipe) id: number) {
    return this.landingService.deleteStat(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('projects')
  createProject(@Body() dto: CreateProjectDto) {
    return this.landingService.createProject(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('projects/:id')
  updateProject(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.landingService.updateProject(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('projects/:id')
  deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.landingService.deleteProject(id);
  }
}
