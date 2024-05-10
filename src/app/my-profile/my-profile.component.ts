import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MyProfile} from "../model/MyProfile";
import {UserService} from "../service/UserService";
import {MyProfileUpdateRequest} from "../model/MyProfileUpdateRequest";
import { FormBuilder } from '@angular/forms';
import {Router} from "@angular/router";
import {ImagePreviewService} from "../service/util/ImagepreviewService";


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  myProfile: MyProfile| undefined;
  myProfileUpdateRequest: MyProfileUpdateRequest | undefined;
  showImageUpload: boolean = false;
  editMode: boolean = false;
  private formDirty: boolean = false;
  showConfirmDialog: boolean = false;
  confirmUsername: string = '';
  currentFile?: File;
  message = '';
  preview = '';
  imageUrl: string | ArrayBuffer | null = null;
  showPreview = false;


  constructor(private imagePreviewService: ImagePreviewService, private userService: UserService, private formBuilder: FormBuilder, private router:Router) {
  }

  ngOnInit(): void {
    this.getUserProfile();


  }

  getUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (profile: MyProfile) => {
        this.myProfile = profile;
        console.log(this.myProfile);
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
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        console.log(file);
        this.preview = '';
        this.currentFile = file;
        this.imagePreviewService.openPreviewModal(file);

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.imagePreviewService.openPreviewModal(e.target.result);
        };

      }
    }
  }
  toggleFileInput() {
    this.fileInput.nativeElement.click();
  }
}
