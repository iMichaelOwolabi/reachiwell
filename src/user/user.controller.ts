import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/signup')
  async createUserAccount(@Body() userData) {
    return this.userService.createUserAccount(userData);
  }

  @Post('auth/login')
  async login(@Body() userData) {
    return this.userService.login(userData);
  }

  @Get()
  async getAllUser() {
    return this.userService.getAllUser();
  }
}
