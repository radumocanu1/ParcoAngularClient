import {Component, OnDestroy, OnInit} from '@angular/core';
import {Chat} from "../model/Chat";
import {interval, Subscription, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MessageRequest} from "../model/MessageRequest";
import {Message} from "../model/Message";
import {ChatService} from "../service/ChatService";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  chatID!: string;
  userUUID!: string;
  chat!: Chat;
  newMessage: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private chatService: ChatService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.chatID = params.get('chatID')!;
      this.userUUID = params.get('userUUID')!;
      this.loadChat();
      this.subscription.add(
        interval(5000).pipe(
          switchMap(() => this.chatService.getChat(this.chatID))
        ).subscribe(chat => {
          if (JSON.stringify(this.chat) !== JSON.stringify(chat)) {
            this.chat = chat;
          }
        })
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadChat() {
    this.chatService.getChat(this.chatID).subscribe(chat => this.chat = chat);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const messageRequest: MessageRequest = { messageContent: this.newMessage };
      this.chatService.sendMessage(this.chatID, messageRequest).subscribe(
        (data: String) =>
          console.log(JSON.stringify(data)),
      );
      this.newMessage = '';
      setTimeout(() => this.loadChat(), 500);
    }
  }

  isCurrentUserMessage(message: Message): boolean {
    return message.senderUUID === this.userUUID;
  }
}
