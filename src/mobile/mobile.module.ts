import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';
import { MobileRepository } from './mobile.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MobileRepository]), AuthModule],
  controllers: [MobileController],
  providers: [MobileService],
})
export class MobileModule {}
