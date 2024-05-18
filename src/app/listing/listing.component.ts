import { Component, OnInit } from '@angular/core';
import { Listing } from "../model/Listing";
import { MinimalUser } from "../model/MinimalUser";
import { ActivatedRoute, Router } from "@angular/router";
import { ListingService } from "../service/ListingService";
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ImageModalComponent } from "../image-modal/image-modal.component";
import { RentDialogComponent } from '../rent-dialog/rent-dialog.component';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  listing: Listing | undefined;
  user: MinimalUser = {
    userUUID: 'user-uuid-placeholder',
    rating: 4.5,
    name: 'Test Name',
    profilePicURL: 'https://randomuser.me/api/portraits/men/1.jpg'
  };
  mapOptions!: google.maps.MapOptions;
  marker!: any;
  pictures: Array<string> = [];
  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private modalService: BsModalService,
    private router: Router,
    public dialog: MatDialog
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

          }
        );
      }
    });
  }
  addPicturesToModal(listing: Listing): void{
    this.pictures.push(listing.mainPicture)
    for (let index = 0; index < listing.pictures.length; index++) {
      this.pictures.push(listing.pictures[index]);
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
    // Implement send message functionality
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
}
