import { Injectable } from '@nestjs/common';
import { Conversation } from './schemas/converstaion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async createConversation(userId: string) {
    const conversation = await this.conversationModel.create(userId);

    return conversation;
  }
}
