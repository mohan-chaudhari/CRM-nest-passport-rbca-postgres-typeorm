import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @Column()
  password: string;

  @Column()
  accountType: ACCOUNT_TYPE;

  @Column()
  email: string;

  @Column()
  @IsString()
  address: string;

  @Column()
  @IsNumber()
  balance: number;

  @Column()
  roles: string;
}
export enum ACCOUNT_TYPE {
  savings = 'savings',
  current = 'current',
}
