import {Component, OnDestroy, OnInit} from '@angular/core';
import {KeycloakProfile} from "keycloak-js";
import {KeycloakService} from "keycloak-angular";
import {DeleteAccountService} from "../service/util/DeleteAccountService";
import {interval, Subject, Subscription, switchMap} from "rxjs";
import {ChatResponse} from "../model/ChatResponse";
import {ChatService} from "../service/ChatService";
import {UnreadChat} from "../model/UnreadChat";
import {UserService} from "../service/UserService";
import {ProfilePictureResponse} from "../model/ProfilePictureResponse";
import {Router} from "@angular/router";
import {AppConfigService} from "../service/AppConfigService";

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.css'
})
export class ProfileDropdownComponent implements OnInit, OnDestroy {
  websiteDomain:string

  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  isDropdownOpen = false;
  unreadMessages!: number;
  profilePic!:string
  private subscription: Subscription = new Subscription();
  ready: boolean = true;


  constructor(private deleteAccountService: DeleteAccountService,
              private readonly keycloak: KeycloakService,
              private chatService: ChatService,
              private userService: UserService,
              private router: Router,
              private appConfig: AppConfigService) {
    this.websiteDomain = this.appConfig.websiteDomain;

  }

  public async ngOnInit() {
    this.isLoggedIn = this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      const token = await this.keycloak.getToken();
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const roles = decodedToken.realm_access.roles;
      if (roles.includes('admin')) {
        this.router.navigate(['/admin/listings']);
      }
      else{
        this.userService.getUserProfileImage().subscribe(
          (profilePictureResponse:ProfilePictureResponse) =>{
            this.profilePic = profilePictureResponse.profilePictureBytes
            // rest call was done to backend service, component can be show now
          }
        )
        this.startPoolingUnreadMessages()
      }



    }
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
    this.keycloak.login({redirectUri:`${this.websiteDomain}/myProfile`});
  }


  public logout(): void {
    this.keycloak.logout(`${this.websiteDomain}/register`).then(() => {
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
