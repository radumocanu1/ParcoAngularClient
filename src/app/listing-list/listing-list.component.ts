import {Component, OnInit} from '@angular/core';
import {Listing} from "../model/Listing";
import {ListingService} from "../service/ListingService";

@Component({
  selector: 'app-listing-list',
  templateUrl: './listing-list.component.html',
  styleUrl: './listing-list.component.css'
})
export class ListingListComponent implements OnInit {
  listings!: Listing[];

  constructor(private listingService: ListingService) { }

  ngOnInit(): void {
    this.getListings();
  }

  getListings(): void {
    this.listingService.getAllListings()
      .subscribe(listings => this.listings = listings);
  }
}
