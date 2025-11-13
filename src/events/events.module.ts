import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  conversationSchema,
} from 'src/conversation/schemas/converstaion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: conversationSchema },
    ]),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
