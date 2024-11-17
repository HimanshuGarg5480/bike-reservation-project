import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, Status } from './reservation.entity';
import { Bike } from '../bike/bike.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Bike)
    private readonly bikeRepository: Repository<Bike>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createReservation(
    userId: number,
    bikeId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Reservation> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const bike = await this.bikeRepository.findOneBy({ id: bikeId });

    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    if (!bike) throw new NotFoundException(`Bike with ID ${bikeId} not found`);
    const reservation = this.reservationRepository.create({
      user,
      bike,
      startDate,
      endDate,
      status: Status.active,
    });

    await this.bikeRepository.save(bike);

    return await this.reservationRepository.save(reservation);
  }

  async findAllReservations(): Promise<Reservation[]> {
      return await this.reservationRepository.find({ relations: ['bike'] });
  }

  async findUserReservations(userId: number): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { user: { id: userId } },
      relations: ['bike'],
    });
  }

  async cancelReservation(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['bike'],
    });
    if (!reservation)
      throw new NotFoundException(`Reservation with ID ${id} not found`);

    reservation.bike.isAvailable = true;
    await this.bikeRepository.save(reservation.bike);

    reservation.status = Status.canceled;
    return await this.reservationRepository.save(reservation);
  }

  async deleteReservation(id: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['bike'],
    });
    if (!reservation)
      throw new NotFoundException(`Reservation with ID ${id} not found`);

    reservation.bike.isAvailable = true;
    await this.bikeRepository.save(reservation.bike);

    await this.cancelReservation(id);

    const result = await this.reservationRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Reservation with ID ${id} not found`);
  }

  async updateReservationRating(
    id: number,
    rating: number,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({ id });
    if (!reservation)
      throw new NotFoundException(`Reservation with ID ${id} not found`);

    if (rating<1 || rating>5)
      throw new NotFoundException(`rating cannot be less then 1 or greater then 5`);

    reservation.rating = rating;
    return await this.reservationRepository.save(reservation);
  }

  async findBikeReservations(bikeId: number): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { bike: { id: bikeId } },
      relations: ['bike'],
    });
  }
}
