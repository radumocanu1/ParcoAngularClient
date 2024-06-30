import {Component, OnInit} from '@angular/core';
import {MinimalListing} from "../model/MinimalListing";
import {ActivatedRoute, Router} from "@angular/router";
import {ListingService} from "../service/ListingService";
import {SnackbarService} from "../service/util/SnackbarService";
import {ChatResponse} from "../model/ChatResponse";

@Component({
  selector: 'app-user-listings',
  templateUrl: './user-listings.component.html',
  styleUrl: './user-listings.component.css'
})
export class UserListingsComponent implements OnInit {
  hasListings: boolean = true;
  loading: boolean = true;
  userUUID!:string;
  paginatedListings: MinimalListing[] = [];

  constructor(private router: Router,
              private listingService: ListingService,
              private snackbarService: SnackbarService,
              private activatedRoute: ActivatedRoute,) {
  }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userUUID = params.get('userUUID')!;
    this.listingService.getUserListings(this.userUUID).subscribe(
      (data: MinimalListing[]) => {
        this.paginatedListings = data;
        this.loading = false;
        if(this.paginatedListings.length == 0){
          this.hasListings = false;
        }
      }
    )
  });
  }

  openSnackBar() {
    this.snackbarService.openSnackBar(' Anuntul a fost sters! ');
  }

  public deleteListing(listingUUID: string): void {
    this.loading = true
    this.listingService.deleteListing(listingUUID).subscribe(
      (data: string) => {
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
