import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Listing} from "../model/Listing";
import {loadStripe} from "@stripe/stripe-js";
import {PaymentService} from "../service/PaymentService";
import {ListingPaymentRequest} from "../model/ListingPaymentRequest";

@Component({
  selector: 'app-rent-dialog',
  templateUrl: './rent-dialog.component.html',
  styleUrl: './rent-dialog.component.css'
})
export class RentDialogComponent implements OnInit {
  minEndDate!: Date | null;
  maxEndDate!: Date | null;
  rentForm: FormGroup
  stripePromise = loadStripe('pk_test_51PJjZcLWWVz5JGxgQSeSt6L9AgbNUfduZkh4vXSiNVuXpXaJ2wXF2dlDBtXEcgbp4a74IboBchMGqdUQsJPFQNWD008ANiDKXo');


  constructor(
    public dialogRef: MatDialogRef<RentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { listing: Listing },
    private fb: FormBuilder,
    private stripeService: PaymentService

  ) {
    this.rentForm = this.fb.group({
      startDate: ['',Validators.required],
      endDate: ['',Validators.required],
      duration: ['Alegere manuala'],
      carNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    //todo add logic here regarding this
    // this.rentForm.get('duration')?.valueChanges.subscribe(value => {
    //   if (value !== 'Alegere manuala') {
    //     this.rentForm.get('endDate')?.disable();
    //     this.rentForm.get('endDate')?.setValue(null);
    //   } else {
    //     this.rentForm.get('endDate')?.enable();
    //   }
    // });

  }
  async initiatePayment(title: string, amount: number, listingUUID:string, startDate:string, endDate:string, carNumber:string): Promise<void> {
    this.stripeService.createCheckoutSession(new ListingPaymentRequest(title,amount,listingUUID, startDate, endDate, carNumber)).subscribe(async (sessionUrl: string) => {
      const stripe = await this.stripePromise;
      stripe?.redirectToCheckout({ sessionId: sessionUrl });
    });
  }
  todayDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  }
  updateEndDateMinMax(startDate: Date): void {
    if (startDate) {
      const minEndDate = new Date(startDate);
      minEndDate.setDate(minEndDate.getDate() + 1);
      const maxEndDate = new Date(startDate);
      maxEndDate.setFullYear(maxEndDate.getFullYear() + 1);
      this.minEndDate = minEndDate;
      this.maxEndDate = maxEndDate;
    } else {
      this.minEndDate = null;
      this.maxEndDate = null// Reset minEndDate if startDate is null
    }
  }
  convertDateToDDMMYYYY(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
   onConfirm(): void {
    if (this.rentForm.valid) {
      const listingPaymentRequest: ListingPaymentRequest =  this.rentForm.getRawValue()
     this.initiatePayment(this.data.listing.title, this.data.listing.price, this.data.listing.listingUUID, this.convertDateToDDMMYYYY(new Date(listingPaymentRequest.startDate)), this.convertDateToDDMMYYYY(new Date(listingPaymentRequest.endDate)), listingPaymentRequest.carNumber)
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
