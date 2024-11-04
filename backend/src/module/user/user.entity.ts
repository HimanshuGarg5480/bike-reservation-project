import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reservation } from '../reservation/reservation.entity';

export enum Role {
    MANAGER = 'MANAGER',
    REGULAR = 'REGULAR',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: Role.REGULAR })
  role: Role; // 'MANAGER' or 'REGULAR'

  @OneToMany(() => Reservation, reservation => reservation.user)
  reservations: Reservation[];
}
