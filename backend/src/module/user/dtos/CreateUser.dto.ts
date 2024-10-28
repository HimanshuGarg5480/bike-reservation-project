import { Role } from "../user.entity";

export class CreateUserDto {
    username: string;
    email: string;
    password: string;
    role?:Role;
  }