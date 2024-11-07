import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BikeService } from './bike.service';
import { Bike } from './bike.entity';
import { ExtendedRequest } from 'src/utils/request.interface';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../user/user.entity';
import { RoleAuthGuard } from 'src/guards/roleAuth.guard';
import { CreateBikeDto } from './dtos/createBike.dto';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';
import { CreateBikeSchema } from './validations/createBike.validation';
import { UpdateBikeDto } from './dtos/UpdateBike.dto';
import { FilterBikesParm } from './utils/types';

@Controller('bikes')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @Get('filter')
  @UseGuards(JwtAuthGuard)
  async filterBikes(
    @Request() req: ExtendedRequest,
    @Query('model') model?: string,
    @Query('color') color?: string,
    @Query('location') location?: string,
    @Query('avgRating') avgRating?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ):Promise<FilterBikesParm> {
    return this.bikeService.filterBikes(req, {
      model,
      color,
      location,
      avgRating: avgRating ? parseFloat(avgRating.toString()) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      offset: offset ? parseInt(offset.toString()) : 0,
      limit: limit ? parseInt(limit.toString()) : 10,
    });
  }

  @Post()
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard,RoleAuthGuard)
  @UsePipes(new JoiValidationPipe(CreateBikeSchema))
  async create(@Body() bikeData: CreateBikeDto): Promise<Bike> {
    return await this.bikeService.create(bikeData);
  }

  @Get()
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard,RoleAuthGuard)
  async findAll(): Promise<Bike[]> {
    return await this.bikeService.findAll();
  }

  @Get(':id')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard,RoleAuthGuard)
  async findOne(@Param('id') id: number): Promise<Bike> {
    return await this.bikeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard,RoleAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<UpdateBikeDto>,
  ): Promise<Bike> {
    return await this.bikeService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard,RoleAuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.bikeService.remove(id);
  }
}
