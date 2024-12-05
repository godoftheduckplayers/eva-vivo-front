import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from './services/websocket.service';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Message} from './services/Message';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [NgOptimizedImage, MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, NgForOf, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'eva-vivo-front';

  messages: Message[] = [];

  constructor(private readonly webSocketService: WebsocketService, private readonly sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.webSocketService.getMessages()?.subscribe(
      (message) => {
        console.log("received message: ", message);
        this.messages.push({
          'type': 'bot',
          'message': message
        });
      }
    );
  }

  sendMessage(message: HTMLInputElement) {
    let currentMessage: Message = {
      type: 'user',
      message: message.value
    };
    this.messages.push(currentMessage);
    this.webSocketService.sendMessage(currentMessage);
    message.value = "";
  }

  ngOnDestroy(): void {
    this.webSocketService.close();
  }

  sanitize(message: Message): SafeHtml {
    if (message.type === 'bot') {
      return this.sanitizer.bypassSecurityTrustHtml(message.message);
    } else {
      return this.sanitizer.bypassSecurityTrustHtml("<span>" + message.message + "</span>");
    }
  }
}
