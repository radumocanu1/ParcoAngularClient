import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Listing} from "../model/Listing";
import {ListingService} from "../service/ListingService";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-admin-listing',
  templateUrl: './admin-listing.component.html',
  styleUrl: './admin-listing.component.css'
})
export class AdminListingComponent implements OnInit {
  @Input() listing: Listing | undefined;
  showRejectDialog: boolean = false;
  rejectionReason: string = '';
  pictures: Array<string> = [];

  constructor(private listingService: ListingService,
              private route: ActivatedRoute,) {
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const listingId = params.get('listingUUID');
      console.log(listingId);
      if (listingId) {
        this.listingService.getListing(listingId).subscribe(
          (data: Listing) => {
            console.log(data)
            this.listing = data;
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
  acceptListing() {
    // Implementare specifică cerințelor tale
  }

  toggleRejectDialog() {
    this.showRejectDialog = !this.showRejectDialog;
  }

  submitRejection() {
    console.log(this.rejectionReason);
  }


}
