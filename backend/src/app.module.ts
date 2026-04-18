import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthhModule } from './modules/authh/authh.module';
import { UsersModule } from './modules/users/users.module';
import { ServicesModule } from './modules/services/services.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthhModule } from './modules/authh/authh.module';

@Module({
  imports: [AuthhModule, AuthModule, ServicesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
