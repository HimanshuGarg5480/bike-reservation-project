import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { authController } from './auth.controller';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'SecretKey',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UserController, authController],
  providers: [UserService, JwtAuthGuard],
  exports: [UserService],
})
export class UserModule {}
