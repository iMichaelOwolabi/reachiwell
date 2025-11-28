/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { AccountVerification } from './schemas/accountVerification.schema';
import { UserStatus } from './enum/user.enum';
import { verifyPassword, generateToken } from './utils/auth.utils';
import { generateRandomCode } from '../utils/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(AccountVerification.name)
    private accountVerificationModel: Model<AccountVerification>,
  ) {}

  async createUserAccount(body) {
    const existingUser = await this.userModel
      .findOne()
      .where({ email: body.email });

    if (existingUser) {
      throw new ConflictException('User with the same email already exists');
    }
    const createdUser = await this.userModel.create(body);

    const accountVerificationCode: string = generateRandomCode();

    await this.accountVerificationModel.create({
      userId: createdUser.id,
      code: accountVerificationCode,
      status: 'pending',
    });

    // send confirmation email to user account. This will be a random code that expires within 24 hours
    // Also notify admin of the user account
    return createdUser;
  }

  async login(userCredentials) {
    const user = await this.userModel
      .findOne()
      .where({ email: userCredentials.email });

    console.log(user);

    if (!user || user.status !== UserStatus.active) {
      throw new ConflictException(
        'Invalid email or password, please check and try again.',
      );
    }

    const verifiedPassword = await verifyPassword(
      userCredentials.password,
      user.password,
    ); // Verify user password

    if (!verifiedPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    //Generate login token
    const token: string = generateToken({ userId: user.id });

    // Update user last logged in

    // Return token to user

    return { token };
  }

  async getAllUser() {
    const allUser = await this.userModel.find();
    return allUser;
  }

  async generateAuthenticationToken(userId: string): Promise<string> {
    return generateToken({ userId }); // Generate a token using user ID and role
  }
}
