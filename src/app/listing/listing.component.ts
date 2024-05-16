import {Component, OnInit} from '@angular/core';
import {Listing} from "../model/Listing";
import {ActivatedRoute} from "@angular/router";
import {ListingService} from "../service/ListingService";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ImageModalComponent} from "../image-modal/image-modal.component";

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css'
})
export class ListingComponent implements OnInit {
  listing: Listing | undefined;
  mapOptions!: google.maps.MapOptions;
  marker!: any;
  bsModalRef!: BsModalRef;



  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private modalService: BsModalService

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const listingId = params.get('listingId');
      if (listingId) {
        this.listingService.getListing(listingId).subscribe(
          (data: Listing) => {
            this.listing = data;
            console.log(this.listing);
            this.initializeMap();
          }
        );
      }
    });
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
  openImageModal(images: string[]): void {
    const initialState = {
      images: images
    };
    this.bsModalRef = this.modalService.show(ImageModalComponent, { initialState });
  }

}
