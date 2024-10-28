import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';
import { LoginUserSchema } from './validations/loginuser.validate';
import { ExtendedRequest } from 'src/utils/request.interface';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { CreateUserSchema } from './validations/createuser.validate';

@Controller('auth')
export class authController {
  constructor(private userService: UserService) {}

  @Post('signup')
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const newUser = await this.userService.createUser(createUserDto, res);

      return res.status(201).json({
        message: 'User created successfully',
        user: newUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
        error: error.message,
      });
    }
  }

  // Login a user
  @Post('login')
  @UsePipes(new JoiValidationPipe(LoginUserSchema))
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.loginUser(loginUserDto, res);

      return res.status(200).json({
        message: 'Login successful',
        user: user,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        error: error.message,
      });
    }
  }

  // Logout a user
  @Post('logout')
  async logoutUser(@Res() res: Response) {
    try {
      await this.userService.logoutUser(res);
      return res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error logging out',
        error: error.message,
      });
    }
  }

  // Check if user is authenticated
  @Get('check-auth')
  @UseGuards(JwtAuthGuard)
  async checkAuth(@Req() req: ExtendedRequest) {
    return {
      success: Boolean(req.user),
      user: req.user,
    };
  }
}
