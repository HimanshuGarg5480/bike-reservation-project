import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './bike.entity';
import { BikeService } from './bike.service';
import { BikeController } from './bike.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bike])],
  providers: [BikeService],
  controllers: [BikeController],
})
export class BikeModule {}
