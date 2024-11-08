import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserParm, LoginUserParm } from './utils/types';
import { Response } from 'express';
import { CreateUserDto } from './dtos/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(userData: CreateUserParm, res: Response): Promise<any> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new Error('Email already in use'); // Handle email already in use
    }

    // Validate password length
    if (userData.password && userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long'); // Handle password length validation
    }

    userData.password = await bcrypt.hash(userData.password, 10);
    const newUser = this.userRepository.create(userData);
    return await this.userRepository
      .save(newUser)
      .then(() => {
        const token = this.jwtService.sign({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        });
        res.cookie('jwt', token, { httpOnly: true });
        // Remove password before returning user data
        const { password, ...userWithoutPassword } = newUser;
        return { ...userWithoutPassword, token };
      })
      .catch((error) => {
        throw new Error('Error creating user: ' + error.message); // Handle errors during user creation
      });
  }

  async loginUser(
    userData: LoginUserParm,
    res: Response,
  ): Promise<any> {
    const { email, password } = userData;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.jwtService.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
      res.cookie('jwt', token, { httpOnly: true });
      // Remove password before returning user data
      const { password, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, token };
    }
    else{
      throw new Error('Email or password is incorrect');
    }
  }

  async logoutUser(res: Response): Promise<any> {
    res.clearCookie('jwt');
    
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  async deleteUser(userId): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found'); // Handle user not found
    }
    await this.userRepository.remove(user); // Delete the user
  }

  async editUser(userId: number, userData: Partial<CreateUserDto>): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found'); // Handle user not found
    }

    // Update user fields
    Object.assign(user, userData);
    return await this.userRepository.save(user)
      .then(updatedUser => {
        // Remove password before returning user data
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
      })
      .catch((error) => {
        throw new Error('Error updating user: ' + error.message); // Handle errors during user update
      });
  }
}
