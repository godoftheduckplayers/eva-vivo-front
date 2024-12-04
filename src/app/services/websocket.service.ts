import {Injectable} from '@angular/core';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {Observable} from 'rxjs';
import {Message} from './Message';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebSocketSubject<any> | undefined;

  constructor() {
    this.connect();
  }

  connect(): void {
    this.socket = new WebSocketSubject({
      url: 'ws://localhost:8765',
      deserializer: ({ data }) => {
        try {
          console.log(data)
          return data;
        } catch (e) {
          console.error('Received non-JSON message', data);
          return data;
        }
      }
    });
  }

  sendMessage(msg: Message): void {
    console.log('Sending message: ', msg);
    this.socket?.next(msg.message);
  }

  close(): void {
    this.socket?.complete();
  }

  getMessages(): Observable<any> | undefined {
    return this.socket?.asObservable();
  }
}
