import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  Delete,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './user.entity';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { RoleAuthGuard } from 'src/guards/roleAuth.guard';
import { CreateUserDto } from './dtos/CreateUser.dto';

@Controller('user')
export class UserController {
  // Create a new user
  constructor(private userService: UserService) {}

  // Get all users
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Res() response: Response) {
    const users = await this.userService.getAllUsers();
    return response.json(users); // Return the list of users as JSON
  }

  // Delete a user by ID
  @Delete(':id')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  async deleteUser(@Param('id') userId: any, @Res() response: Response) {
    try {
      await this.userService.deleteUser(userId);
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: error.message });
    }
  }

  // Edit user data by ID
  @Post(':id/edit')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  async editUser(
    @Param('id') userId: any,
    @Body() userData: Partial<CreateUserDto>,
    @Res() response: Response,
  ) {
    try {
      const updatedUser = await this.userService.editUser(userId, userData);
      return response.json(updatedUser); // Return the updated user data as JSON
    } catch (error) {
      return response.status(404).json({ message: error.message }); // Handle errors
    }
  }
}
