import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './bike.entity';
import { BikeService } from './bike.service';
import { BikeController } from './bike.controller';
import { Reservation } from '../reservation/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bike,Reservation])],
  providers: [BikeService],
  controllers: [BikeController],
})
export class BikeModule {}
