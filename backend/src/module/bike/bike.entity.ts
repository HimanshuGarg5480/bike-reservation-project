import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../reservation/reservation.entity';
// import { Reservation } from './Reservation';

@Entity()
export class Bike {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    model: string;

    @Column()
    color: string;

    @Column()
    location: string;

    @Column({ default: true })
    isAvailable: boolean;

    @Column({ type: 'float', nullable: true })
    avgRating: number;

    @OneToMany(() => Reservation, reservation => reservation.bike)
    reservations: Reservation[];
}
