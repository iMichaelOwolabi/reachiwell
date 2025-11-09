import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({})
export class EventsGateway {
  @WebSocketServer() server: Server<any>
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    // When message comes in, before it's emited, store it
    this.server.emit('message', message);
    // this.server.to()
    // this.server.socketsJoin(`${userInfo.firstName}-${new Date().toString()}`)
    // trigger system response after emitting
  }

  // sendMessage() {
  //   this.server.emit('newMessage', 'Hello right from the server');
  // }

  // acknowledgeConnect() {
  //   this.server.on('connection', (socket) => {
  //     this.server.emit('Properly connected')
  // }
// )}
}
