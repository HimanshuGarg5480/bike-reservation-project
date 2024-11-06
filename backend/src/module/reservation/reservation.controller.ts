import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.entity';

@Controller('reservations')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Post()
    async create(
        @Body('userId') userId: number,
        @Body('bikeId') bikeId: number,
        @Body('fromDateTime') startDate: string,
        @Body('toDateTime') endDate: string,
    ): Promise<Reservation> {
        return await this.reservationService.createReservation(userId, bikeId, new Date(startDate), new Date(endDate));
    }

    @Get()
    async findAll() {
        return "hello"
    }

    // @Get()
    // async findAll(): Promise<Reservation[]> {
    //     return await this.reservationService.findAllReservations();
    // }

    @Get('user/:userId')
    async findUserReservations(@Param('userId') userId: number): Promise<Reservation[]> {
        return await this.reservationService.findUserReservations(userId);
    }

    @Patch(':id/status')
    async cancelReservation(
        @Param('id') id: number,
    ): Promise<Reservation> {
        return await this.reservationService.cancelReservation(id);
    }

    @Patch(':id/rating')
    async updateReservationRating(
        @Param('id') id: number,
        @Body('rating') rating: number,
    ): Promise<Reservation> {
        return await this.reservationService.updateReservationRating(id, rating);
    }
    
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        return await this.reservationService.deleteReservation(id);
    }
}
