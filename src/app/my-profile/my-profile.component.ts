import {booleanAttribute, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MyProfile} from "../model/MyProfile";
import {UserService} from "../service/UserService";
import {MyProfileUpdateRequest} from "../model/MyProfileUpdateRequest";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ImagePreviewService} from "../service/util/ImagepreviewService";
import { Location } from '@angular/common';
import {SnackbarService} from "../service/util/SnackbarService";



@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  myProfile: MyProfile| undefined;
  myProfileUpdateRequest= new MyProfileUpdateRequest();
  isEditMode: boolean = false;
  currentFile?: File;




  constructor(
              private route: ActivatedRoute,
              private location: Location,
              private imagePreviewService: ImagePreviewService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private router:Router,
              private snackbarService: SnackbarService,) {

  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['edit'] === 'true'){
      this.isEditMode = true;
    }
    this.getUserProfile();


  }
  modifyUserDetails(){
    console.log(this.myProfileUpdateRequest)
    this.userService.updateUser(this.myProfileUpdateRequest).subscribe(
        (profile: MyProfile) => {
          this.myProfile = profile;
          this.snackbarService.openSnackBar('✨ Informatiile personale au fost actualizate cu succes! ✨');
          this.goBack()
        }
      )

  }

  enterEditMode(): void {
    this.router.navigate(['/myProfile'], { queryParams: {edit: 'true'}});
    this.isEditMode = true
  }
  goBack(): void {
    this.isEditMode = false
    this.location.back();
  }

  getUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (profile: MyProfile) => {
        this.myProfile = profile;
        if (profile.age == 0 ){

        }
        this.myProfileUpdateRequest = profile;
        console.log(this.myProfileUpdateRequest);
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

  public cancelEdit(): void{
    window.location.reload()
  }
  protected readonly localStorage = localStorage;
  updateProfileForm = this.formBuilder.group({
    name: '',
    address: ''
  });
  selectFile(event: any): void {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
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
