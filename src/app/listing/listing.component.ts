import { Component, OnInit } from '@angular/core';
import { Listing } from "../model/Listing";
import { MinimalUser } from "../model/MinimalUser";
import { ActivatedRoute, Router } from "@angular/router";
import { ListingService } from "../service/ListingService";
import { MatDialog } from '@angular/material/dialog';
import {Location} from '@angular/common';

import { RentDialogComponent } from '../rent-dialog/rent-dialog.component';
import {ChatService} from "../service/ChatService";
import {ChatResponse} from "../model/ChatResponse";
import {FeedbackService} from "../service/FeedbackService";
import {FeedbackResponse} from "../model/FeedbackResponse";


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  listing: Listing | undefined;
  user!: MinimalUser
  mapOptions!: google.maps.MapOptions;
  marker!: any;
  pictures: Array<string> = [];
  feedbacks!:FeedbackResponse[]
  ratings: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // [1, 2, 3, ..., 10]
  filteredFeedbacks: FeedbackResponse[] = [];
  feedbackCounts: { [key: number]: number } = {};



  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private router: Router,
    public dialog: MatDialog,
    private chatService: ChatService,
    private feedbackService: FeedbackService

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const listingId = params.get('listingId');
      if (listingId) {
        this.listingService.getListing(listingId).subscribe(
          (data: Listing) => {
            console.log(data)
            this.listing = data;
            this.initializeMap();
            this.addPicturesToModal(this.listing)
            this.user = data.minimalUser
          }
        );
        this.feedbackService.getAllListingFeedbacks(listingId).subscribe(
          (data:FeedbackResponse[]) => {
            console.log(data)
            this.feedbacks = data
            this.filteredFeedbacks = this.feedbacks
        }
        )
      }
    });
  }

  addPicturesToModal(listing: Listing): void{
    this.pictures.push(listing.mainPicture)
    for (let index = 0; index < listing.pictures.length; index++) {
      this.pictures.push(listing.pictures[index]);
    }
  }

  filterFeedbacks(event: any) {
    const selectedRating = event.value;
    if (selectedRating) {
      this.filteredFeedbacks = this.feedbacks.filter(feedback => +feedback.ratingGiven === selectedRating);
    } else {
      this.filteredFeedbacks = [...this.feedbacks];
    }
  }

  initializeMap(): void {
    if (this.listing) {
      this.mapOptions = {
        center: {
          lat: parseFloat(this.listing.latitude),
          lng: parseFloat(this.listing.longitude)
        },
        zoom: 18,
        mapTypeId: 'satellite'
      };
      this.marker = {
        position: {
          lat: parseFloat(this.listing.latitude),
          lng: parseFloat(this.listing.longitude)
        }
      };
    }
  }

  navigateToUserProfile(): void {
    this.router.navigate([`/profile/${this.user.userUUID}`]);
  }

  sendMessage(): void {
    this.chatService.tryToGetChat(this.user.userUUID).subscribe((chatResponse: ChatResponse) => {
      this.router.navigate([`/chat/${chatResponse.chatUUID}`]);
    });
  }

  openRentDialog(): void {
    const dialogRef = this.dialog.open(RentDialogComponent, {
      width: '300px',
      data: { listing: this.listing }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle rental confirmation
      }
    });
  }


  navigateToProfile(authorUUID: string) {
    this.router.navigate([`/profile/${authorUUID}`]);
  }
}
