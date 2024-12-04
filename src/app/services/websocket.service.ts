import {Injectable} from '@angular/core';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {Observable} from 'rxjs';
import {Message} from './Message';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebSocketSubject<string> | undefined;

  constructor() {
    this.connect();
  }

  connect(): void {
    this.socket = new WebSocketSubject('ws://localhost:8765');
  }

  sendMessage(msg: Message): void {
    console.log('Sending message: ', msg);
    this.socket?.next(msg.message);
  }

  close(): void {
    this.socket?.complete();
  }

  getMessages(): Observable<string> | undefined {
    return this.socket?.asObservable();
  }
}
