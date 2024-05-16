import {Component, OnInit} from '@angular/core';
import {Listing} from "../model/Listing";
import {ActivatedRoute} from "@angular/router";
import {ListingService} from "../service/ListingService";

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css'
})
export class ListingComponent implements OnInit {
  listing: Listing | undefined;
  mapOptions!: google.maps.MapOptions;
  marker!: any;
  constructor(private route: ActivatedRoute, private listingService: ListingService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.listingService.getListing(params.get('listingId')).subscribe(
        (data: Listing) => {
          this.listing = data;
          console.log(this.listing);
          this.initializeMap();
        }
      );
    });  }
  initializeMap(): void {
    this.mapOptions = {
      // @ts-ignore
      center: { lat: parseFloat(this.listing.latitude), lng: parseFloat(this.listing.longitude) },
      zoom: 18,
      mapTypeId: 'satellite',

    };
    this.marker = {
      // @ts-ignore
      position: { lat: parseFloat(this.listing.latitude), lng: parseFloat(this.listing.longitude) },
    }




  }
}
