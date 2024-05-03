import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MyProfile} from "../model/MyProfile";
import {UserService} from "../service/UserService";
import {MyProfileUpdateRequest} from "../model/MyProfileUpdateRequest";
import { FormBuilder } from '@angular/forms';
import {Router} from "@angular/router";


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  myProfile: MyProfile| undefined;
  myProfileUpdateRequest: MyProfileUpdateRequest | undefined;
  showImageUpload: boolean = false;
  editMode: boolean = false;
  private formDirty: boolean = false;
  showConfirmDialog: boolean = false;
  confirmUsername: string = '';


  constructor(private userService: UserService, private formBuilder: FormBuilder, private router:Router) {
  }

  ngOnInit(): void {
    this.getUserProfile();


  }

  getUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (profile: MyProfile) => {
        this.myProfile = profile;
        this.myProfileUpdateRequest = new MyProfileUpdateRequest(profile.username,profile.email,profile.phoneNumber,profile.firstName,profile.lastName,profile.age);
        if (this.myProfile.hasProfilePicture){
          localStorage.setItem("currentUserProfilePicture", this.profilePicture())
        }
      }
    );
  }
  showConfirmPrompt() {
    this.showConfirmDialog = true;
  }
  deleteProfile() {
    if (this.confirmUsername === this.myProfile?.username) {

      this.userService.deleteUser().subscribe(() => {
        alert('Contul a fost șters cu succes!');
        window.location.reload();
      });
    } else {
      console.error('Username-ul introdus nu corespunde cu username-ul profilului!');
    }
    this.showConfirmDialog = false;
  }
  cancelDelete() {
    this.showConfirmDialog = false;
    this.confirmUsername = '';
  }
  onInputChange() {
    this.formDirty = true;
    return true
  }

  isFormDirty() {
    return this.formDirty;
  }
  public profilePicture(): string {
    if (this.myProfile) {
    return this.userService.getProfilePictureUrl(this.myProfile.profilePictureBytes)
      }
    return ''
  }
  public toggleEditMode(): void{
    this.editMode = !this.editMode;
  }
  public updateProfile(): void {
    console.log(this.myProfileUpdateRequest);
    this.userService.updateUser(this.myProfileUpdateRequest).subscribe(
      (profile: MyProfile) => {
        this.myProfile = profile;
        this.editMode = false;
        alert("Datele au fost actualizate cu succes!")
      }
    )
  }
  public cancelEdit(): void{
    window.location.reload()
  }
  protected readonly localStorage = localStorage;
  updateProfileForm = this.formBuilder.group({
    name: '',
    address: ''
  });
}
