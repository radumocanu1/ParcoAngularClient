import {Component, Input, OnInit} from '@angular/core';
import {Listing} from "../model/Listing";
import {ListingService} from "../service/ListingService";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminUpdateListingRequest} from "../model/AdminUpdateListingRequest";
import {AdminListingDecision} from "../model/AdminListingDecision";
import {datepickerAnimation} from "ngx-bootstrap/datepicker/datepicker-animations";

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
  mapOptions!: google.maps.MapOptions;
  marker!: any;



  constructor(private listingService: ListingService,
              private route: ActivatedRoute,
              private router: Router) {
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const listingId = params.get('listingUUID');
      if (listingId) {
        this.listingService.getListing(listingId).subscribe(
          (data: Listing) => {
            this.listing = data;
            this.addPicturesToModal(this.listing)
            this.initializeMap();

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
  acceptListing(listingUUID:string|undefined, listingName:string|undefined):void {
    const adminUpdateListingRequest = new AdminUpdateListingRequest("Anuntul <"+ listingName +"> a fost acceptat, puteti verifica sectiunea 'Anunturile mele' pentru detalii", AdminListingDecision.ACCEPT);
    this.listingService.updateListingStatus(listingUUID, adminUpdateListingRequest).subscribe({
      next: () => {
        this.router.navigate(['/admin/listings']);
      },
      error: (err) => {
        console.error('Error updating listing status', err);
      }
    });

  }

  toggleRejectDialog() {
    this.showRejectDialog = !this.showRejectDialog;
  }

  submitRejection(listingUUID:string|undefined, listingName:string|undefined) {
    const adminUpdateListingRequest = new AdminUpdateListingRequest("Anuntul <"+ listingName +"> nu a fost acceptat... Motivul este: " + this.rejectionReason + " Daca considerati ca a fost produsa o eroare, va rugam adresativa serviciului de asistenta folosind optiunea 'Raporteaza'.", AdminListingDecision.REJECT);
    this.listingService.updateListingStatus(listingUUID, adminUpdateListingRequest).subscribe({
      next: () => {
        this.router.navigate(['/admin/listings']);
      },
      error: (err) => {
        console.error('Error updating listing status', err);
      }
    });
  }


}
