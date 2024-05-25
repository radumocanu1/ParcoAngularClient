import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Listing} from "../model/Listing";
import {FormBuilder} from "@angular/forms";
import {PaymentService} from "../service/PaymentService";
import {ListingService} from "../service/ListingService";
import {SnackbarService} from "../service/util/SnackbarService";
import {RentDialogComponent} from "../rent-dialog/rent-dialog.component";
import {FeedbackService} from "../service/FeedbackService";
import {FeedbackRequest} from "../model/FeedbackRequest";
import {FeedbackResponse} from "../model/FeedbackResponse";
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrl: './feedback-dialog.component.css'
})
export class FeedbackDialogComponent {
  ratings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedRating!: number;
  feedbackMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<RentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { listing: Listing },
    private snackbarService: SnackbarService,
    private feedbackService: FeedbackService,
    private router: Router,
  ){}


  sendFeedback() {
    if (this.feedbackMessage.length >= 5 && this.selectedRating) {
      const feedback = {
        rating: this.selectedRating,
        message: this.feedbackMessage
      };
      const feedbackRequest: FeedbackRequest = new FeedbackRequest(this.feedbackMessage,this.selectedRating);
      this.feedbackService.addFeedback(feedbackRequest,this.data.listing.listingUUID).subscribe((feedbackResponse: FeedbackResponse) => {
        this.openSnackbar();
        this.dialogRef.close();
        this.router.navigate([`/listing/${this.data.listing.listingUUID}`]);
      })
    }
  }
  openSnackbar(): void {
    this.snackbarService.openSnackBar("✨ Feedbackul a fost adaugat cu succes !✨")
  }


}
