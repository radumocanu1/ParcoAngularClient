import {Component, OnInit} from '@angular/core';
import {UserProfileView} from "../model/UserProfileView";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../service/UserService";
import {Feedback} from "../model/Feedback";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user!: UserProfileView;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
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
    console.log('Mesaj trimis către utilizatorul ' + this.user.username);
  }

}
