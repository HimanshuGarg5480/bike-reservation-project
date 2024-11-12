import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from './bike.entity';
import { ExtendedRequest } from 'src/utils/request.interface';
import { Role } from '../user/user.entity';
import { CreateBikeDto } from './dtos/createBike.dto';
import { UpdateBikeDto } from './dtos/UpdateBike.dto';
import { FilterBikesParm } from './utils/types';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike)
    private readonly bikeRepository: Repository<Bike>,
  ) {}

  async filterBikes(
    req: ExtendedRequest,
    filters: {
      model?: string;
      color?: string;
      location?: string;
      avgRating?: number;
      startDate?: Date;
      endDate?: Date;
      offset?: number;
      limit?: number;
    },
  ): Promise<FilterBikesParm> {
    const {
      model,
      color,
      location,
      avgRating,
      startDate,
      endDate,
      offset = 0,
      limit = 10,
    } = filters;
    const userType = req.user?.role; // Get userType from the request object
    // Validate startDate and endDate

    if (startDate && endDate) {
      const now = new Date();
      if (startDate < now || endDate < now) {
        throw new BadRequestException(
          'Start date and end date must be in the future.',
        ); // Updated to use BadRequestException
      }
      if (endDate < startDate) {
        throw new BadRequestException(
          'End date cannot be earlier than start date.',
        ); // Updated to use BadRequestException
      }
    }

    // Base query with filters for model, color, location, avgRating, and availabilite
    const query = this.bikeRepository.createQueryBuilder('bike');
    if (model) query.andWhere('bike.model LIKE :model', { model: `${model}%` });
    if (color) query.andWhere('bike.color LIKE :color', { color: `${color}%` });
    if (location) query.andWhere('bike.location LIKE :location', { location: `${location}%` });
    if (avgRating)
      query.andWhere('bike.avgRating >= :avgRating', { avgRating });

    // Ensure only available bikes are fetched based on userType
    if (userType === Role.REGULAR) {
      query.andWhere('bike.isAvailable = true'); // Set isAvailable to true for REGULAR users
    }

    // Filtering for bikes available within the specified date range
    if (startDate && endDate) {
      query
        .leftJoinAndSelect('bike.reservations', 'reservation')
        .andWhere(
          '(reservation.startDate IS NULL OR (reservation.endDate < :startDate OR reservation.startDate > :endDate))',
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

  async create(bikeData: CreateBikeDto): Promise<Bike> {
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

  async update(id: number, updateData: Partial<UpdateBikeDto>): Promise<Bike> {
    console.log(updateData)
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
 