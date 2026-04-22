import { Controller, Get } from '@nestjs/common';
import { LandingService } from './landing.service';

@Controller() // Manejado globalmente por app.setGlobalPrefix('api')
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

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

  @Get('process-steps')
  getProcessSteps() {
    return this.landingService.getProcessSteps();
  }

  @Get('blog/latest')
  getBlogPosts() {
    return this.landingService.getBlogPosts();
  }
}
