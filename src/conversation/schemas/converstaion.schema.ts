import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ConversationStatus } from '../enum/conversation.enum';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  roomName: string;

  @Prop({ required: true, default: ConversationStatus.active })
  status: string;

  @Prop({ default: false })
  escalated?: boolean;
}

export const conversationSchema = SchemaFactory.createForClass(Conversation);
