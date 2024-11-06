import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from '../bike/bike.entity';
import { Reservation } from '../reservation/reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { UserModule } from '../user/user.module';
import { BikeModule } from '../bike/bike.module';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bike, Reservation,User]),
    UserModule,
    BikeModule,
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
