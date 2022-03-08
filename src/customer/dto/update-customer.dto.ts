import { PartialType } from '@nestjs/mapped-types';
import { ACCOUNT_TYPE } from '../entities/customer.entity';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  accountType?: ACCOUNT_TYPE;
  email?: string;
  address?: string;
}
