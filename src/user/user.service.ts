import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUserAccount(body) {
    const existingUser = await this.userModel
      .findOne()
      .where({ email: body.email });

    if (existingUser) {
      throw new ConflictException('User with the same email already exists');
    }
    const createdUser = await this.userModel.create(body);
    return createdUser;
  }

  async getAllUser() {
    const allUser = await this.userModel.find();
    return allUser;
  }
}
