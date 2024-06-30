import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../service/UserService";
import {ChatService} from "../service/ChatService";
import {ChatResponse} from "../model/ChatResponse";
import {UserProfile} from "../model/UserProfile";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user!: UserProfile;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userService.getUser(params.get('userId')).subscribe(
        (data: UserProfile) => {
          this.user = data;
          if (this.user.sameUser) {
            this.router.navigate(['/myProfile']);
          }
        }
      );
    });
  }

  sendMessage(): void {
    this.chatService.tryToGetChat(this.user.userUUID).subscribe((chatResponse: ChatResponse) => {
      this.router.navigate([`/chat/${chatResponse.chatUUID}`]);
    });
  }

}
