import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './bike.entity';
import { BikeService } from './bike.service';
import { BikeController } from './bike.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Bike]),JwtModule],
  providers: [BikeService,JwtAuthGuard],
  controllers: [BikeController],
})
export class BikeModule {}
