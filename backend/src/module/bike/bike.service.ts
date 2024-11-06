import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from './bike.entity';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike)
    private readonly bikeRepository: Repository<Bike>,
  ) {}

  async filterBikes(filters: {
    model?: string;
    color?: string;
    location?: string;
    avgRating?: number;
    startDate?: Date;
    endDate?: Date;
    offset?: number;
    limit?: number;
  }): Promise<{ allowBooking: boolean; bikeArray: Bike[] }> {
    const { model, color, location, avgRating, startDate, endDate, offset = 0, limit = 10 } = filters;

    // Validate startDate and endDate
    if (startDate && endDate) {
      const now = new Date();
      if (startDate < now || endDate < now) {
        throw new Error('Start date and end date must be in the future.');
      }
      if (endDate < startDate) { 
        throw new Error('End date cannot be earlier than start date.');
      }
    }

    // Base query with filters for model, color, location, avgRating, and availability
    const query = this.bikeRepository.createQueryBuilder('bike');

    if (model) query.andWhere('bike.model = :model', { model });
    if (color) query.andWhere('bike.color = :color', { color });
    if (location) query.andWhere('bike.location = :location', { location });
    if (avgRating)
      query.andWhere('bike.avgRating >= :avgRating', { avgRating });

    // Ensure only available bikes are fetched
    query.andWhere('bike.isAvailable = true');

    // Filtering for bikes available within the specified date range
    if (startDate && endDate) {
      query
        .leftJoinAndSelect('bike.reservations', 'reservation')
        .andWhere(
          '(reservation.id IS NULL OR (reservation.endDate < :startDate OR reservation.startDate > :endDate))',
          {
            startDate: startDate.toISOString(), // Convert to ISO string for SQLite
            endDate: endDate.toISOString(), // Convert to ISO string for SQLite
          },
        );
    }

    const bikeArray = await query.skip(offset).take(limit).getMany();
    if (startDate && endDate) {
      return { allowBooking: true, bikeArray: bikeArray };
    }
    return { allowBooking: false, bikeArray: bikeArray };
  }

  async create(bikeData: Partial<Bike>): Promise<Bike> {
    const bike = this.bikeRepository.create(bikeData);
    return await this.bikeRepository.save(bike);
  }

  async findAll(): Promise<Bike[]> {
    return await this.bikeRepository.find();
  }

  async findOne(id: number): Promise<Bike> {
    const bike = await this.bikeRepository.findOneBy({ id });
    if (!bike) throw new NotFoundException(`Bike with ID ${id} not found`);
    return bike;
  }

  async update(id: number, updateData: Partial<Bike>): Promise<Bike> {
    await this.bikeRepository.update(id, updateData);
    const updatedBike = await this.findOne(id);
    return updatedBike;
  }

  async remove(id: number): Promise<void> {
    const result = await this.bikeRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Bike with ID ${id} not found`);
  }
}
