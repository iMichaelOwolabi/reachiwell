import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  Ack,
  OnGatewayConnection,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { User } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from 'src/conversation/schemas/converstaion.schema';

@WebSocketGateway({})
export class EventsGateway implements OnGatewayConnection {
  constructor(
    // @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  @WebSocketServer() server: Server;
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @Ack() ack: (response: { status: string; data: string }) => void,
  ) {
    ack({ status: 'received', data });
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Properly connected', client.handshake.auth);
    this.conversationModel.create({
      userId: '69078f0a348cab5dbd7da8e5',
      roomName: 'testRoom',
    });
    if (client.handshake.headers.name !== 'Michael') {
      console.log(client.handshake.auth, 'AUTH');
      // client.disconnect();
      return;
    }
    // On connection, create, room and conversation record using the user information from the auth section of the socket headers
  }

  // When message comes in, before it's emited, store it
  // this.server.emit('message', 'message')

  // this.server.socketsJoin(`${userInfo.firstName}-${new Date().toString()}`)
  // trigger system response after emitting

  // sendMessage() {
  //   this.server.emit('newMessage', 'Hello right from the server');
  // }

  // acknowledgeConnect() {
  //   this.server.on('connection', (socket) => {
  //     this.server.emit('Properly connected')
  // }
  // )}
}
