import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { interval, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageRequest } from '../model/MessageRequest';
import { Message } from '../model/Message';
import { ChatService } from '../service/ChatService';
import { ChatResponse } from '../model/ChatResponse';
import {AdminChat} from "../model/AdminChat";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  chatID!: string;
  chatResponse!: ChatResponse;
  newMessage: string = '';
  private subscription: Subscription = new Subscription();
  adminUUIDChat!: string
  adminGenericChat:boolean = false


  @ViewChildren('messagesContainer') messagesContainers!: QueryList<ElementRef>;

  constructor(private route: ActivatedRoute, private chatService: ChatService, private router: Router) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.chatService.getAdminUUID().subscribe(
      (data:AdminChat) =>{
        this.adminUUIDChat = data.genericChatUUID
        this.route.paramMap.subscribe(params => {
          this.chatID = params.get('chatUUID')!;
          if (this.adminUUIDChat == this.chatID)
            this.adminGenericChat = true

          this.chatService.getChat(this.chatID).subscribe((chatResponse: ChatResponse) => {
            this.chatResponse = chatResponse;
            this.startPollingChat();
            this.scrollToBottom();
          });
        });
      }
    )

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  startPollingChat() {
    this.subscription.add(
      interval(5000).pipe(
        switchMap(() => this.chatService.getChat(this.chatID))
      ).subscribe((chatResponse: ChatResponse) => {
        if (JSON.stringify(this.chatResponse.messages) !== JSON.stringify(chatResponse.messages)) {
          this.chatResponse = chatResponse;
          this.scrollToBottom();
        }
      })
    );
  }


  sendMessage() {
    if (this.newMessage.trim()) {
      const messageRequest: MessageRequest = { messageContent: this.newMessage };
      this.chatService.sendMessage(this.chatID, messageRequest).subscribe(() => {
        this.newMessage = '';
        this.chatService.getChat(this.chatID).subscribe((chatResponse: ChatResponse) => {
          this.chatResponse = chatResponse;
          this.scrollToBottom();
        });
      });
    }
  }

  isCurrentUserMessage(message: Message): boolean {
    if (!this.adminGenericChat)
      return message.senderUUID === this.chatResponse.otherUserUUID;
    return false
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainers.forEach((container: ElementRef) => {
        container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
      });
    }, 100);
  }

  public goToUserProfile() {
    this.router.navigate(['/profile', this.chatResponse.otherUserUUID]);
  }
}
