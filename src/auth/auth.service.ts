import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from 'src/customer/customer.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,

    private jwtService: JwtService,
  ) {}
  async validateCustomer(username, password): Promise<any> {
    const customer = await this.customerService.findOne(username);
    console.log(customer);

    if (!customer) throw new NotFoundException('Customer not found**');

    await bcrypt.compare(password, customer.password, function (err, res) {
      if (err) throw new Error('Error in Validation');
      console.log(res);

      if (res) {
        const { username, password, ...rest } = customer;
        console.log('rest', rest);

        return rest;
      } else return null;
    });
    // if (customer.password === password) {
    //   const { username, password, ...rest } = customer;
    //   return rest;
    // }
    // return null;
  }

  async login(customer: any) {
    const payload = { name: customer.username, sub: customer.id };
    return { token: this.jwtService.sign(payload) };
  }
}
