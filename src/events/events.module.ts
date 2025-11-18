import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  conversationSchema,
} from 'src/conversation/schemas/converstaion.schema';
import { Message, messageSchema } from '../message/schemas/mesaage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: conversationSchema },
      { name: Message.name, schema: messageSchema },
    ]),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
