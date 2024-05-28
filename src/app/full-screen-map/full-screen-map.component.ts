import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MapsListing} from "../model/MapsListing";
import {Router} from "@angular/router";
import {ListingService} from "../service/ListingService";
import {DomSanitizer} from "@angular/platform-browser";
import {BytesToImagePipe} from "../service/util/BytesToImagePipe";

@Component({
  selector: 'app-full-screen-map',
  templateUrl: './full-screen-map.component.html',
  styleUrl: './full-screen-map.component.css'
})
export class FullScreenMapComponent implements OnInit {
  mapOptions!: google.maps.MapOptions;
  markers: { position: google.maps.LatLngLiteral, listing: MapsListing }[] = [];
  infoWindow: google.maps.InfoWindow;
  selectedMarker: { position: google.maps.LatLngLiteral; listing: MapsListing } | undefined;

  @ViewChild('infoWindowTemplate', { static: true }) infoWindowTemplate!: TemplateRef<any>;

  constructor(private listingService: ListingService, private router: Router, private sanitizer: DomSanitizer, private bytesToImagePipe: BytesToImagePipe) {
    this.infoWindow = new google.maps.InfoWindow();
  }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.listingService.getAllMapsListings().subscribe(listings => {
      if (listings && listings.length > 0) {
        const center = {
          lat: parseFloat(listings[0].latitude),
          lng: parseFloat(listings[0].longitude)
        };

        this.mapOptions = {
          center: { lat: 44.4286545011596, lng: 26.101418742985853 },
          zoom: 12,
          mapTypeId: 'satellite'
        };

        this.markers = listings.map(listing => ({
          position: {
            lat: parseFloat(listing.latitude),
            lng: parseFloat(listing.longitude)
          },
          listing: listing
        }));
      }
    });
  }

  onMarkerClick(marker: { position: google.maps.LatLngLiteral; listing: MapsListing }, map: google.maps.Map | undefined): void {
    const contentString = `
      <div class="info-window">
        <img src="${this.bytesToImagePipe.transform(marker.listing.mainPicture)}" alt="Listing Image" style="width: 200px; height: 200px;">
        <p class="title"> <strong>Titlu: ${marker.listing.title}</p>
        <p>Pret/zi: ${marker.listing.price} RON</p>
        <button mat-fab extended color="primary" id="navigate-button">Vezi detalii</button>
      </div>
    `;
    this.infoWindow.setContent(contentString);
    this.infoWindow.setPosition(marker.position);
    this.infoWindow.open(map);  // Folosește instanța corectă a hărții

    google.maps.event.addListenerOnce(this.infoWindow, 'domready', () => {
      const navigateButton = document.getElementById('navigate-button');
      if (navigateButton) {
        navigateButton.addEventListener('click', () => {
          this.router.navigate([`/listing/${marker.listing.listingUUID}`]);
        });
      }
    });
  }

}
