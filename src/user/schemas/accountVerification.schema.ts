import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountVerificationDocument = HydratedDocument<AccountVerification>;

@Schema({ timestamps: true })
export class AccountVerification {
  @Prop()
  code: string;

  @Prop()
  status: string;

  @Prop()
  userId: string;
}

export const accountVerificationSchema =
  SchemaFactory.createForClass(AccountVerification);
