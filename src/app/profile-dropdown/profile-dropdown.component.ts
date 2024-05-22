import {Component, OnDestroy, OnInit} from '@angular/core';
import {KeycloakProfile} from "keycloak-js";
import {KeycloakService} from "keycloak-angular";
import {DeleteAccountService} from "../service/util/DeleteAccountService";
import {interval, Subscription, switchMap} from "rxjs";
import {ChatResponse} from "../model/ChatResponse";
import {ChatService} from "../service/ChatService";
import {UnreadChat} from "../model/UnreadChat";

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.css'
})
export class ProfileDropdownComponent implements OnInit, OnDestroy {
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  isDropdownOpen = false;
  unreadMessages!: number;
  private subscription: Subscription = new Subscription();
  constructor(private deleteAccountService: DeleteAccountService,
              private readonly keycloak: KeycloakService,
              private chatService: ChatService) {
  }

  public async ngOnInit() {
    this.isLoggedIn = this.keycloak.isLoggedIn();
    if (!this.isLoggedIn) {
      localStorage.removeItem("currentUserProfilePicture");

    }

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
    this.startPoolingUnreadMessages()
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  startPoolingUnreadMessages(){
    // first call straight away, not wait 5 sec
    this.chatService.checkForUnreadMessages().subscribe((unreadChat: UnreadChat) => {
      this.unreadMessages = unreadChat.numberOfUnreadChats;
    });
    this.subscription.add(
      interval(5000).pipe(
        switchMap(() => this.chatService.checkForUnreadMessages())
      ).subscribe((unreadChat: UnreadChat) => {
       this.unreadMessages = unreadChat.numberOfUnreadChats
      })
    )
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  public login() {
    this.keycloak.login({redirectUri:"http://localhost:4200/myProfile"});
  }

  public logout(): void {
    this.keycloak.logout("http://localhost:4200/register").then(() => {
      console.log("Logout successful");
    }).catch((error: any) => {
      console.error("Logout failed:", error);
    });
  }
  public deleteAccount(): void {
    this.deleteAccountService.openPreviewModal()
  }

  protected readonly localStorage = localStorage;
}
