import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

//   @OneToMany(() => Rental, (rental) => rental.user)
//   rentals: Rental[];
}
