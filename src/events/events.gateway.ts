import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from '../conversation/schemas/converstaion.schema';
import { Message } from '../message/schemas/mesaage.schema';
import { jwtValidator } from 'src/user/utils/auth.utils';
import { MessageInterface } from '../message/interface/message.interface';
import { generateAiResponse } from '../thirdparty/openaiModel';
import { triageResponse } from 'src/utils/helpers';
import { AiReponseInterface } from 'src/utils/utils.interface';

@WebSocketGateway({})
export class EventsGateway implements OnGatewayConnection {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    console.log('Properly connected', client.id);

    // Decode token to get user information
    const decodedToken = await jwtValidator(client.handshake.headers['auth']);
    console.log('USERID', decodedToken.userId);
    await this.conversationModel.create({
      userId: decodedToken.userId,
      roomName: client.handshake.headers['room-name'],
    });

    //Create the room
    console.log(client.id, 'CLIENT ID');
    this.createroom(client.handshake.headers['room-name'], client.id);
  }

  // Listen for messages from clients
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    // Respond from the server
    const decodedToken = await jwtValidator(client.handshake.headers['auth']);
    let conversation = await this.getConversationByRoomName(
      client.handshake.headers['room-name'],
    );

    if (!conversation) {
      // create the conversation if it doesn't exist
      conversation = await this.conversationModel.create({
        userId: decodedToken.userId,
        roomName: client.handshake.headers['room-name'],
      });
    }

    // Save the nessage using the conversation ID for reference
    await this.saveMessage({
      conversationId: conversation.id,
      senderId: decodedToken.userId,
      message: data,
    });

    //Make call to the AI model (OpenAI) at this point to analyse the user's message and respond accordingly
    const aiResponse: any = await generateAiResponse(data);
    console.log('Received message:', typeof data);

    // Save AI response as a message for reference
    await this.saveMessage({
      conversationId: conversation.id,
      senderId: 'AI Model',
      message: JSON.stringify(aiResponse),
    });

    const formattedResponse = JSON.parse(aiResponse);

    const responseToUser = triageResponse(formattedResponse?.category);

    await this.saveMessage({
      conversationId: conversation.id,
      senderId: 'The System',
      message: responseToUser,
    });

    // Emit the AI response back to the client in the same room
    this.server.in(conversation.roomName).emit('message', responseToUser);
  }

  @SubscribeMessage('escalate')
  async handleEscalation(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    // const decodedToken = await jwtValidator(client.handshake.headers['auth']);
    // let conversation = await this.getConversationByRoomName(
    //   client.handshake.headers['room-name'],
    // );
    // // Notify the admin team about the escalation here via email
    // // Emit the AI response back to the client in the same room
    // this.server.in(conversation.roomName).emit('message', aiResponse);
  }

  private async saveMessage(messageData: MessageInterface) {
    return await this.messageModel.create(messageData);
  }

  async getConversationByRoomName(roomName) {
    return this.conversationModel.findOne({ roomName });
  }

  // sendMessage(message: string) {
  //   this.server.emit('newMessage', 'Hello right from the server');
  // }

  createroom(roomName, socketId: string): void {
    this.server.in(socketId).socketsJoin(roomName);
  }

  afterInit(): void {
    // Listen for the 'join-room' event on the adapter
    this.server.of('/').adapter.on('create-room', (room) => {
      console.log(`Room ${room} has been created`);
      // ... your custom logic here ...
    });
  }

  getNumberOfRooms(): void {
    const rooms = this.server.of('/').adapter.rooms;
    console.log(rooms, 'ROOMS');
  }

  getNumberOfRoomName(): void {
    const rooms = this.server.of('/').adapter.rooms.keys();
    console.log(rooms, 'Name');
  }

  handleJoinRoom(): void {
    this.server.of('/').adapter.on('join-room', (room, id) => {
      console.log(`Socket ${id} joined room ${room}`);
      // ... your custom logic here ...
    });
  }

  randomMessages = [
    'Hello! How can I assist you today?',
    'What would you like to know more about?',
    'Feel free to ask me anything!',
    'I am here to help you with your queries.',
    'Let me know if you need any assistance.',
    'How can I make your day better?',
    'Is there something specific you are looking for?',
    'I can provide information on a variety of topics about healthcare in Canada.',
    `"Don't hesitate to reach out if you have questions."`,
    `"I'm here to support you in any way I can."`,
    'What information can I provide for you today?',
    'Is there a particular topic you are interested in?',
    'Drop your questions here, and I will do my best to assist you!',
    'Healthcare is important! How can I help you navigate it?',
    'Your health matters! What would you like to discuss?',
    'Let’s explore healthcare options together!',
    'I can help you understand healthcare services better.',
    'Looking for healthcare advice? Ask away!',
    'I’m here to guide you through healthcare information.',
    'What healthcare topics are on your mind today?',
    'Feel free to share your healthcare concerns with me.',
    'Always happy to help with healthcare questions!',
    'Water is the best drink for hydration!',
    'Regular exercise is great for your health!',
    'Eating fruits and vegetables can boost your immune system.',
    'Getting enough sleep is essential for overall well-being.',
    'Remember to take breaks and relax during your day.',
    'Staying positive can have a big impact on your health!',
  ];

  generateRandomMessage(): string {
    const randomIndex = Math.floor(Math.random() * this.randomMessages.length);
    return this.randomMessages[randomIndex];
  }
}
