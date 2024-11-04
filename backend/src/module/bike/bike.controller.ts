import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BikeService } from './bike.service';
import { Bike } from './bike.entity';

@Controller('bikes')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @Get('filter')
  async filterBikes(
    @Query('model') model?: string,
    @Query('color') color?: string,
    @Query('location') location?: string,
    @Query('avgRating') avgRating?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bikeService.filterBikes({
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
  async create(@Body() bikeData: Partial<Bike>): Promise<Bike> {
    return await this.bikeService.create(bikeData);
  }

  @Get()
  async findAll(): Promise<Bike[]> {
    return await this.bikeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Bike> {
    return await this.bikeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<Bike>,
  ): Promise<Bike> {
    return await this.bikeService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.bikeService.remove(id);
  }
}
