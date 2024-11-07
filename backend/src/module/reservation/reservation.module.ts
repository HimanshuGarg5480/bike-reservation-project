import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from '../bike/bike.entity';
import { Reservation } from '../reservation/reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { UserModule } from '../user/user.module';
import { BikeModule } from '../bike/bike.module';
import { User } from '../user/user.entity';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bike, Reservation,User]),
    JwtModule,
    UserModule,
    BikeModule,
  ],
  providers: [ReservationService,JwtAuthGuard],
  controllers: [ReservationController],
})
export class ReservationModule {}
