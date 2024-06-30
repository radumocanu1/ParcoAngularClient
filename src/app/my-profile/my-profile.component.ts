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
import {FeedbackService} from "../service/FeedbackService";
import {Feedback} from "../model/Feedback";
import {FeedbackResponse} from "../model/FeedbackResponse";



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
  showFeedbacks: boolean = false
  loading: boolean = false;
  isPhoneNumberValid: boolean = true;
  isFullNameValid = true;
  isAgeValid = true;
  feedbacks: FeedbackResponse[] = [];
  ratings: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  filteredFeedbacks: FeedbackResponse[] = [];




  constructor(
              private route: ActivatedRoute,
              private ImageViewService: ImageViewService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private router:Router,
              private snackbarService: SnackbarService,
              private feedbackService: FeedbackService,) {

  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['edit'] === 'true'){
      this.isEditMode = true;
    }
    this.getUserProfile();
  }

  validatePhoneNumber() {
    const phonePattern = /^07\d{8}$/;
    if (this.myProfileUpdateRequest.phoneNumber && !phonePattern.test(this.myProfileUpdateRequest.phoneNumber)) {
      this.isPhoneNumberValid = false;
    } else {
      this.isPhoneNumberValid = true;
    }
  }
  validateFullName() {
    const sqlInjectionRegex = /('|"|;|--|\/\*|\*\/|\\)/;
    this.isFullNameValid = !sqlInjectionRegex.test(this.myProfileUpdateRequest.username);
  }

  validateAge() {
    this.isAgeValid = this.myProfileUpdateRequest.age >= 18;
  }
  navigateToProfile(authorUUID: string) {
    this.router.navigate([`/profile/${authorUUID}`]);
  }
  filterFeedbacks(event: any) {
    const selectedRating = event.value;
    if (selectedRating) {
      this.filteredFeedbacks = this.feedbacks.filter(feedback => +feedback.ratingGiven === selectedRating);
    } else {
      this.filteredFeedbacks = [...this.feedbacks];
    }
  }
  modifyUserDetails(){
    this.userService.updateUser(this.myProfileUpdateRequest).subscribe(
        (profile: UserProfile) => {
          this.myProfile = profile;
          this.snackbarService.openSnackBar('✨ Informatiile personale au fost actualizate cu succes! ✨');
          this.goBack()
        }
      )

  }
  deleteProfilePicture(){
    this.loading = true;
    this.userService.deleteProfilePic().subscribe({
        complete: () => {
          window.location.reload()
        }
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


  showUserFeedbacks(){
    this.loading = true;
    this.showFeedbacks = !this.showFeedbacks;
    this.feedbackService.getAllUserFeedbacks().subscribe(
      (feedbacks: FeedbackResponse[]) => {
        this.feedbacks = feedbacks
        this.filteredFeedbacks = feedbacks
        this.loading = false
      }
    )

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
