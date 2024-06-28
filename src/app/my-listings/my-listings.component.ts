import {Component, OnInit} from '@angular/core';
import {MinimalListing} from "../model/MinimalListing";
import {Router} from "@angular/router";
import {ListingService} from "../service/ListingService";
import {SnackbarService} from "../service/util/SnackbarService";
import {ListingStatusChangeRequest} from "../model/ListingStatusChangeRequest";
import {Listing} from "../model/Listing";
import {Status} from "../model/Status";

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
        console.log(data);
        this.paginatedListings = data;
        if (this.paginatedListings.length == 0) {
          this.hasListings = false
        }
        this.loading = false;
      }
    )
  }
  openSnackBar(message: string): void {
    this.snackbarService.openSnackBar(message);
  }

  public deleteListing(listingUUID: string): void {
    this.loading = true
   this.listingService.deleteListing(listingUUID).subscribe(
     (data:string) => {
       this.loading = false
       this.openSnackBar(' Anuntul a fost sters! ')
       this.ngOnInit()


     }
   )

  }
  public navigateToListing(listingUUID: string): void {
    this.router.navigate([`/listing/${listingUUID}`]);
  }
  public changeListingStatus(listing: MinimalListing): void {
    this.loading =  true
    let listingStatusChangeRequest: ListingStatusChangeRequest =  new ListingStatusChangeRequest();
    if (listing.status === Status.ACTIVE)
      listingStatusChangeRequest.status = Status.DEACTIVATED;
    else
      listingStatusChangeRequest.status = Status.ACTIVE;
    this.listingService.updateListingStatusUser(listing.listingUUID, listingStatusChangeRequest).subscribe(
      (data:Listing) => {
        this.snackbarService.openSnackBar("✨Statusul anuntului a fost modificat cu succes!✨");
        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/my-listings']);
      });
  })
}

  protected readonly Status = Status;
}
