import {Component, OnInit} from '@angular/core';
import {MinimalListing} from "../model/MinimalListing";
import {Router} from "@angular/router";
import {ListingService} from "../service/ListingService";

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.css'
})
export class MyListingsComponent implements OnInit{
  paginatedListings: MinimalListing[] = [];
  constructor(private router: Router,
              private listingService: ListingService) {
  }
  onRowClick(row: MinimalListing): void {
    this.router.navigate([`/myListing/${row.listingUUID}`]);
  }

  ngOnInit(): void {
    this.listingService.getMyListings().subscribe(
      (data: MinimalListing[]) => {
        this.paginatedListings = data;
      }
    )
  }

}
