import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { jwtSecret } from 'src/constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}
  async signUp(createCustomerDto: CreateCustomerDto) {
    const exists = await this.customerRepository.findOne({
      username: createCustomerDto.username,
    });
    console.log(exists);
    console.log('**');

    if (exists) throw new BadRequestException('Customer Already exists');

    const customer = new Customer();
    customer.id = uuid();
    customer.username = createCustomerDto.username;
    // customer.password = createCustomerDto.password;
    customer.password = await bcrypt.hash(createCustomerDto.password, 8);
    customer.email = createCustomerDto.email;
    customer.roles = 'customer';
    customer.address = createCustomerDto.address;
    customer.accountType = createCustomerDto.accountType;
    customer.balance = 1000; // initial minimum balance

    const toReturn = await this.customerRepository.save(customer);
    const { password, ...rest } = toReturn;
    return rest;
  }

  async findAll(): Promise<Customer[]> {
    const customers: Customer[] = await this.customerRepository.find({});
    if (!customers) throw new NotFoundException('Customer not found');

    const toreturn: any = customers.map((customer) => {
      const { password, ...rest } = customer;
      return rest;
    });
    return toreturn;
  }
  async findById(id): Promise<any> {
    const { password, ...rest } = await this.customerRepository.findOne({ id });
    if (!rest) throw new NotFoundException('Customer not found');
    return rest;
  }
  async findOne(username): Promise<Customer> {
    const customer = await await this.customerRepository.findOne({ username });
    console.log(username);

    if (!customer) throw new NotFoundException('Customer not found.');
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const updated = await this.customerRepository.update(id, updateCustomerDto);
    if (!updated) throw new NotFoundException('Customer not found');

    if (updated.affected === 1) return 'Data successfully updated...';
    else 'Data successfully not updated.';
  }

  async remove(id: string): Promise<string> {
    const removed = await this.customerRepository.delete(id);
    if (removed.affected === 1) return 'entru removed successfully';
    else return 'Error in removing Entry';
  }
  async returnUser(auth: string): Promise<Customer> {
    try {
      const token = auth.split(' ')[1];
      const decoded: any = await jwt.verify(token, jwtSecret);
      const customer: Customer = await this.findById(decoded.sub);
      if (!customer) throw new NotFoundException('Customer not found');
      return customer;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN);
    }
  }
}
