import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ACCOUNT_TYPE } from '../entities/customer.entity';

export class CreateCustomerDto {
  @IsNotEmpty()
  @MinLength(4, {
    message: 'Username is too short',
  })
  @MaxLength(32, {
    message: 'Username is too long',
  })
  username: string;
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Weak Password',
  })
  password: string;

  accountType: ACCOUNT_TYPE;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  address: string;
}
