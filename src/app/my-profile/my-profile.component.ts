import {Component, OnInit} from '@angular/core';
import {MyProfile} from "../model/MyProfile";
import {UserService} from "../service/UserService";
import {NotificationService} from "../service/NotificationService";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  myProfile: MyProfile| undefined;
  showImageUpload: boolean = false;


  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.getUserProfile();


  }

  getUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (profile: MyProfile) => {
        this.myProfile = profile;
        console.log(this.myProfile);
        if (this.myProfile.hasProfilePicture){
          localStorage.setItem("currentUserProfilePicture", this.profilePicture())
        }
      }
    );
  }
  public profilePicture(): string {
    if (this.myProfile) {
    return this.userService.getProfilePictureUrl(this.myProfile.profilePictureBytes)
      }
    return ''
  }

  protected readonly localStorage = localStorage;
}
