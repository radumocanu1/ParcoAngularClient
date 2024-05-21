import {Component, OnInit} from '@angular/core';
import {UserProfileView} from "../model/UserProfileView";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../service/UserService";
import {Feedback} from "../model/Feedback";
import {ChatService} from "../service/ChatService";
import {ChatResponse} from "../model/ChatResponse";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user!: UserProfileView;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userService.getUser(params.get('userId')).subscribe(
        (data: UserProfileView) => {
          this.user = data;
          this.updateFeedbackProfilePictures();
        }
      );
    });
  }

  updateFeedbackProfilePictures(): void {
    this.user.feedbackList.forEach((feedback: Feedback) => {
      this.userService.getProfilePicturePath(feedback.feedbackAuthor).subscribe(
        (path) => {
          if (path) {
            feedback.profilePicPath = path;
          }
        }
      );
    });
  }
  sendMessage(): void {
    this.chatService.tryToGetChat(this.user.userUUID).subscribe((chatResponse: ChatResponse) => {
      this.router.navigate([`/chat/${chatResponse.chatUUID}/${this.user.userUUID}`]);
    });
  }

}
