import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  logout() {
    // Para JWT, el logout normalmente se maneja en el cliente eliminando el token.
    // Podemos retornar un mensaje de éxito.
    return { message: 'Logout exitoso' };
  }

  @Get('seed')
  seedAdmin() {
    return this.authService.seedAdmin();
  }
}
