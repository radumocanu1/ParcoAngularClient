import {Component, OnInit} from '@angular/core';
import {MinimalListing} from "../model/MinimalListing";
import {Router} from "@angular/router";
import {ListingService} from "../service/ListingService";
import {SnackbarService} from "../service/util/SnackbarService";
import {UserService} from "../service/UserService";

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.css'
})
export class MyListingsComponent implements OnInit{
  loading:boolean = true;
  hasListings:boolean = true;
  paginatedListings: MinimalListing[] = [];
  constructor(private router: Router,
              private listingService: ListingService,
              private snackbarService: SnackbarService) {
  }


  ngOnInit(): void {
    this.listingService.getMyListings().subscribe(
      (data: MinimalListing[]) => {
        this.paginatedListings = data;
        if (this.paginatedListings.length == 0) {
          this.hasListings = false
        }
        this.loading = false;
      }
    )
  }
  openSnackBar() {
    this.snackbarService.openSnackBar(' Anuntul a fost sters! ');
  }

  public deleteListing(listingUUID: string): void {
    this.loading = true
   this.listingService.deleteListing(listingUUID).subscribe(
     (data:string) => {
       console.log(data);
       this.loading = false
       this.openSnackBar()
       this.ngOnInit()


     }
   )

  }
  public navigateToListing(listingUUID: string): void {
    this.router.navigate([`/listing/${listingUUID}`]);
  }
}
