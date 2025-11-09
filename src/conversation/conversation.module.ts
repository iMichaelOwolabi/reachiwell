import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import {
  conversationSchema,
  Conversation,
} from './schemas/converstaion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: conversationSchema },
    ]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
