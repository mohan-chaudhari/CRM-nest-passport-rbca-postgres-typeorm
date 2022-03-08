import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { CustomerService } from '../customer.service';

@Injectable()
export class RolesGaurd implements CanActivate {
  constructor(
    private reflector: Reflector,
    private customerService: CustomerService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) return true;

    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) return false;

    const customer = await this.customerService.returnUser(
      req.headers.authorization,
    );
    return requireRoles.some((role) => customer.roles.includes(role));
  }
}
