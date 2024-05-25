import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Listing} from "../model/Listing";
import {loadStripe} from "@stripe/stripe-js";
import {PaymentService} from "../service/PaymentService";
import {ListingPaymentRequest} from "../model/ListingPaymentRequest";
import {ListingService} from "../service/ListingService";
import {DateRange} from "../model/DateRange";
import {SnackbarService} from "../service/util/SnackbarService";

@Component({
  selector: 'app-rent-dialog',
  templateUrl: './rent-dialog.component.html',
  styleUrl: './rent-dialog.component.css'
})
export class RentDialogComponent implements OnInit {
  minEndDate!: Date | null;
  maxEndDate!: Date | null;
  bookingForm: FormGroup
  stripePromise = loadStripe('pk_test_51PJjZcLWWVz5JGxgQSeSt6L9AgbNUfduZkh4vXSiNVuXpXaJ2wXF2dlDBtXEcgbp4a74IboBchMGqdUQsJPFQNWD008ANiDKXo');
  unavailableDates: DateRange[] = [];
  today = new Date();

  constructor(
    public dialogRef: MatDialogRef<RentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { listing: Listing },
    private fb: FormBuilder,
    private stripeService: PaymentService,
    private listingService: ListingService,
    private snackbarService: SnackbarService,

  ) {
    this.bookingForm = this.fb.group({
      startDate: ['',Validators.required],
      endDate: ['',Validators.required],
      duration: ['Alegere manuala'],
      carNumber: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.listingService.getUnavailableDates(this.data.listing.listingUUID).subscribe(dates => {
      this.unavailableDates = dates;
    });

    this.bookingForm.get('startDate')?.valueChanges.subscribe(date => {
      if (this.bookingForm.get('duration')?.value !== 'Alegere manuala') {
        this.setEndDateAutomatically(date);
      } else {
        this.updateEndDateMinMax(date);
      }
      this.validateDates();
    });

    this.bookingForm.get('duration')?.valueChanges.subscribe(value => {
      const startDate = this.bookingForm.get('startDate')?.value;
      if (startDate) {
        this.setEndDateAutomatically(startDate);
      }
    });
  }

  setEndDateAutomatically(startDate: Date) {
    const duration = this.bookingForm.get('duration')?.value;
    let endDate = new Date(startDate);
    if (duration === '1') {
      endDate.setDate(endDate.getDate() + 7); // 1 week
    } else if (duration === '2') {
      endDate.setMonth(endDate.getMonth() + 1); // 1 month
    } else if (duration === '3') {
      endDate.setMonth(endDate.getMonth() + 3); // 3 months
    }

    this.bookingForm.get('endDate')?.setValue(endDate);
    this.validateDates();
  }

  validateDates() {
    const startDate = this.bookingForm.get('startDate')?.value;
    const endDate = this.bookingForm.get('endDate')?.value;
    const overlapping = this.unavailableDates.some(dateRange => {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return (startDate >= start && startDate <= end) || (endDate >= start && endDate <= end) || (startDate <=start && endDate >= end);
    });

    if (overlapping) {
      this.bookingForm.get('endDate')?.setErrors({ 'overlapping': true });
      this.openSnackBar()
    } else {
      this.bookingForm.get('endDate')?.setErrors(null);
    }
  }
  openSnackBar() {
    this.snackbarService.openSnackBar('Datele selectate sunt invalide, aveti grija sa nu va intersectati cu o alta perioada inchiriata!');
  }

  dateFilter = (d: Date | null): boolean => {
    if (!d) {
      return false;
    }
    const time = d.getTime();
    return !this.unavailableDates.some(dateRange => {
      const start = new Date(dateRange.startDate).getTime();
      const end = new Date(dateRange.endDate).getTime();
      return time >= start && time <= end;
    });
  }

  endDateFilter = (d: Date | null): boolean => {
    if (!d) {
      return false;
    }
    const startDate = this.bookingForm.get('startDate')?.value;
    if (!startDate) {
      return true; // Allow selection if start date is not set
    }
    const startTime = startDate.getTime();
    const time = d.getTime();
    return !this.unavailableDates.some(dateRange => {
      const start = new Date(dateRange.startDate).getTime();
      const end = new Date(dateRange.endDate).getTime();
      return (time >= start && time <= end) || (startTime >= start && startTime <= end);
    });
  }

  updateEndDateMinMax(startDate: Date) {
    const unavailableRange = this.unavailableDates.find(dateRange => {
      const start = new Date(dateRange.startDate).getTime();
      const end = new Date(dateRange.endDate).getTime();
      return startDate.getTime() >= start && startDate.getTime() <= end;
    });
    if (unavailableRange) {
      this.minEndDate = startDate;
      this.maxEndDate = new Date(unavailableRange.startDate);
      this.maxEndDate.setDate(this.maxEndDate.getDate() - 1);
    } else {
      this.minEndDate = startDate;
      this.maxEndDate = new Date(startDate);
      this.maxEndDate.setFullYear(this.maxEndDate.getFullYear() + 1); // Assuming maximum one year
    }
  }

  async initiatePayment(title: string, amount: number, listingUUID: string, startDate: string, endDate: string, carNumber: string): Promise<void> {
    this.stripeService.createCheckoutSession(new ListingPaymentRequest(title, amount, listingUUID, startDate, endDate, carNumber)).subscribe(async (sessionUrl: string) => {
      const stripe = await this.stripePromise;
      stripe?.redirectToCheckout({ sessionId: sessionUrl });
    });
  }

  todayDate(): Date {
    return new Date();
  }

  convertDateToDDMMYYYY(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
   onConfirm(): void {
    if (this.bookingForm.valid) {
      const listingPaymentRequest: ListingPaymentRequest =  this.bookingForm.getRawValue()
     this.initiatePayment(this.data.listing.title, this.data.listing.price, this.data.listing.listingUUID, this.convertDateToDDMMYYYY(new Date(listingPaymentRequest.startDate)), this.convertDateToDDMMYYYY(new Date(listingPaymentRequest.endDate)), listingPaymentRequest.carNumber)
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
