import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.gaurd';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Role } from './Roles/role.enum';
import { Roles } from './Roles/roles.decorator';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    @Inject(forwardRef(() => AuthService)) //circular dependency
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return await this.authService.login(req.user);
    //return req.user;
  }

  @Post('signUp')
  async signUp(@Body() createCustomerDto: CreateCustomerDto): Promise<any> {
    return await this.customerService.signUp(createCustomerDto);
  }

  @UseGuards(JwtAuthGuard)
  //@SetMetadata('roles', [Roles.ADMIN])
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    return await this.customerService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.CUSTOMER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<string> {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return await this.customerService.remove(id);
  }
}
