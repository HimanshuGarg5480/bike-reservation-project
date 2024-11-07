import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dtos/CreateReservation.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../user/user.entity';
import { RoleAuthGuard } from 'src/guards/roleAuth.guard';
import { ExtendedRequest } from 'src/utils/request.interface';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';
import { CreateReservationSchema } from './validations/createReservation.validation';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(CreateReservationSchema))
  async create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const {
      userId,
      bikeId,
      fromDateTime: startDate,
      toDateTime: endDate,
    } = createReservationDto;
    return await this.reservationService.createReservation(
      userId,
      bikeId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get()
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  async findAll(): Promise<Reservation[]> {
    return await this.reservationService.findAllReservations();
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async findUserReservations(
    @Req() req: ExtendedRequest,
    @Param('userId') userId: number,
  ): Promise<Reservation[]> {
    if (userId == req.user.id || req.user.role == Role.MANAGER) {
      return await this.reservationService.findUserReservations(userId);
    } else {
      throw new BadRequestException(
        'Access denied, you cannot see the reservation of other users!',
      );
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async cancelReservation(@Param('id') id: number): Promise<Reservation> {
    return await this.reservationService.cancelReservation(id);
  }

  @Patch(':id/rating')
  @UseGuards(JwtAuthGuard)
  async updateReservationRating(
    @Param('id') id: number,
    @Body('rating') rating: number,
  ): Promise<Reservation> {
    return await this.reservationService.updateReservationRating(id, rating);
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  async delete(@Param('id') id: number): Promise<void> {
    return await this.reservationService.deleteReservation(id);
  }

  @Get('bike/:bikeId')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  async findBikeReservations(
    @Param('bikeId') bikeId: number,
  ): Promise<Reservation[]> {
    return await this.reservationService.findBikeReservations(bikeId);
  }
}
