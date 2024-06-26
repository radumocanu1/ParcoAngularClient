import {Component, OnDestroy, OnInit} from '@angular/core';
import {MinimalChat} from "../model/MinimalChat";
import {Router} from "@angular/router";
import {ChatService} from "../service/ChatService";
import {interval, Subscription, switchMap} from "rxjs";
import {AdminChat} from "../model/AdminChat";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent implements OnInit, OnDestroy {
  minimalChats: MinimalChat[] = [];
  private subscription: Subscription = new Subscription();
  adminUUIDChat!: string





  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {
    this.chatService.getAdminUUID().subscribe(
      (data:AdminChat) =>{
        this.adminUUIDChat = data.genericChatUUID
      }
    )
    this.chatService.getAllUserChats().subscribe((chats: MinimalChat[]) => {
      this.minimalChats = chats;
      this.startPoolingChats();

    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  startPoolingChats() {
    // first call right after refresh ( to update the red dot on the current chat)
    this.chatService.getAllUserChats().subscribe(
      (chats) => {
      this.minimalChats = chats
    })
    this.subscription.add(
      interval(20000).pipe(
        switchMap(() => this.chatService.getAllUserChats())
      ).subscribe((chats) => {
        this.minimalChats = chats
      })
    );
  }

  openChat(chat: MinimalChat): void {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/chat', chat.chatUUID])
    });
  }

}
