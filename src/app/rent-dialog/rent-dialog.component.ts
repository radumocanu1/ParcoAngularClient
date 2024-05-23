import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Listing} from "../model/Listing";
import {loadStripe} from "@stripe/stripe-js";
import {StripeService} from "../service/StripeService";
import {ListingPaymentRequest} from "../model/ListingPaymentRequest";

@Component({
  selector: 'app-rent-dialog',
  templateUrl: './rent-dialog.component.html',
  styleUrl: './rent-dialog.component.css'
})
export class RentDialogComponent implements OnInit {
  rentForm: FormGroup
  stripePromise = loadStripe('pk_test_51PJjZcLWWVz5JGxgQSeSt6L9AgbNUfduZkh4vXSiNVuXpXaJ2wXF2dlDBtXEcgbp4a74IboBchMGqdUQsJPFQNWD008ANiDKXo');


  constructor(
    public dialogRef: MatDialogRef<RentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { listing: Listing },
    private fb: FormBuilder,
    private stripeService: StripeService

  ) {
    this.rentForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      duration: ['1 week'],
      car: ['']
    });
  }

  ngOnInit(): void {
    this.rentForm.get('duration')?.valueChanges.subscribe(value => {
      if (value === 'indefinite') {
        this.rentForm.get('endDate')?.disable();
        this.rentForm.get('endDate')?.setValue(null);
      } else {
        this.rentForm.get('endDate')?.enable();
      }
    });

    // Add logic to disable dates
  }
  async initiatePayment(title: string, amount: number): Promise<void> {
    this.stripeService.createCheckoutSession(new ListingPaymentRequest(title,amount)).subscribe(async (sessionUrl: string) => {
      const stripe = await this.stripePromise;
      stripe?.redirectToCheckout({ sessionId: sessionUrl });
    });
  }

   onConfirm(): void {
    if (this.rentForm.valid) {
     this.initiatePayment(this.data.listing.title, this.data.listing.price)
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
