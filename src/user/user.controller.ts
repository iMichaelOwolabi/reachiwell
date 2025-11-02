import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUserAccount(@Body() userData) {
    return this.userService.createUserAccount(userData);
  }

  @Get()
  async getAllUser() {
    return this.userService.getAllUser();
  }
}
