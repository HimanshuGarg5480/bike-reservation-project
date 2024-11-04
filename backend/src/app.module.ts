import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { User } from './module/user/user.entity';
import { Bike } from './module/bike/bike.entity';
import { BikeModule } from './module/bike/bike.module';
import { Reservation } from './module/reservation/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User,Bike,Reservation],
      synchronize: true,
    }),
    UserModule,
    BikeModule
  ]
})
export class AppModule {}
