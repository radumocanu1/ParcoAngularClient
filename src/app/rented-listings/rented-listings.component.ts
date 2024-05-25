import {Component, OnInit} from '@angular/core';
import {MinimalListing} from "../model/MinimalListing";
import {Router} from "@angular/router";
import {ListingService} from "../service/ListingService";
import {RentDialogComponent} from "../rent-dialog/rent-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FeedbackDialogComponent} from "../feedback-dialog/feedback-dialog.component";

@Component({
  selector: 'app-rented-listings',
  templateUrl: './rented-listings.component.html',
  styleUrl: './rented-listings.component.css'
})
export class RentedListingsComponent implements OnInit {
  listings: MinimalListing[] = [];
  currentDate = new Date();

  constructor(private listingService: ListingService, private router: Router,    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.listingService.getRentedListings().subscribe((data:MinimalListing[]) => {
      this.listings = data;
    });
  }

  daysUntil(startDate: Date): number {
    const start = new Date(startDate);
    const diff = start.getTime() - this.currentDate.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  navigateToListing(listingUUID: string): void {
    this.router.navigate([`/listing/${listingUUID}`]);
  }
  isCurrentOrPast(startDate: Date, endDate: Date): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= this.currentDate && end >= this.currentDate;
  }

  isPast(endDate: Date): boolean {
    const end = new Date(endDate);
    return end < this.currentDate;
  }


  openFeedbackDialog(listing: MinimalListing): void {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '300px',
      data: { listing: listing }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle rental confirmation
      }
    });
  }

}
