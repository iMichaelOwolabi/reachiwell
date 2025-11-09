import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  roomName: string;

  @Prop({ default: false })
  escalated?: boolean;
}

export const conversationSchema = SchemaFactory.createForClass(Conversation);
