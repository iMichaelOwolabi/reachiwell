/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserStatus } from './enum/user.enum';
import { verifyPassword } from './utils/auth.utils';

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

    // send confirmation email to user account. This will be a random code that expires within 24 hours
    // Also notify admin of the user account
    return createdUser;
  }

  async login(userCredentials) {
    const user = await this.userModel
      .findOne()
      .where({ email: userCredentials.email });

    if (!user || user.status !== UserStatus.active) {
      throw new ConflictException('User with the same email already exists');
    }

    const verifiedPassword = await verifyPassword(
      userCredentials.password,
      user.password,
    ); // Verify user password

    if (!verifiedPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    //Generate login token
    const token: string = await this.generateAuthenticationToken(user.id);

    // Update user last logged in

    // Return token to user

    const createdUser = await this.userModel.create(body);
    return createdUser;
  }

  async getAllUser() {
    const allUser = await this.userModel.find();
    return allUser;
  }

  async generateAuthenticationToken(userId: string): Promise<string> {
    const user: User = await this.userRepository.getUserById(userId);
    const userRoles: UserRole[] = await this.userRoleRepo.getUserRole(userId);

    const roles = extractRoles(userRoles);

    return generateToken({ userId, roles, rnplUser: user.rnplUser }); // Generate a token using user ID and role
  }
}
