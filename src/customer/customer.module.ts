import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RolesGaurd } from './Roles/roles.gaurd';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), forwardRef(() => AuthModule)],
  controllers: [CustomerController],
  providers: [CustomerService, { provide: APP_GUARD, useClass: RolesGaurd }],
  exports: [CustomerService],
})
export class CustomerModule {}
