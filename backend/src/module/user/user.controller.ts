import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  // Create a new user
  constructor(
    private userService: UserService,
  ) {}
}
