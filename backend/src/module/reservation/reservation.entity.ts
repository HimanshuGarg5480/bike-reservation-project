import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Bike } from '../bike/bike.entity';

export enum Status {
  active = 'active',
  canceled = 'canceled',
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Bike, (bike) => bike.reservations, { onDelete: 'CASCADE' })
  bike: Bike;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ default: Status.active })
  status: Status;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review: string;
}
