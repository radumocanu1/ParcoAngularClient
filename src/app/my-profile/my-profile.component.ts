import {booleanAttribute, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserProfile} from "../model/UserProfile";
import {UserService} from "../service/UserService";
import {MyProfileUpdateRequest} from "../model/MyProfileUpdateRequest";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ImageViewService} from "../service/util/ImageViewService";
import { Location } from '@angular/common';
import {SnackbarService} from "../service/util/SnackbarService";
import {ChatService} from "../service/ChatService";



@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  myProfile: UserProfile| undefined;
  myProfileUpdateRequest= new MyProfileUpdateRequest();
  isEditMode: boolean = false;
  currentFile?: File;




  constructor(
              private route: ActivatedRoute,
              private location: Location,
              private ImageViewService: ImageViewService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private router:Router,
              private snackbarService: SnackbarService,
              private chatService: ChatService) {

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
        (profile: UserProfile) => {
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
    // navigating to root to refresh current page
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/myProfile']);
    })
  }

  getUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (profile: UserProfile) => {
        this.myProfile = profile;
        this.myProfileUpdateRequest = profile;
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
        this.ImageViewService.openPreviewModal(file);

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.ImageViewService.openPreviewModal(e.target.result);
        };

      }
    }
  }
  toggleFileInput() {
    this.fileInput.nativeElement.click();
  }
}
