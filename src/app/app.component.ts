import {Component, OnInit} from '@angular/core';
import {AppConfigService} from "./service/AppConfigService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})export class AppComponent implements OnInit {
  title = 'Parco';

  constructor(private configService: AppConfigService) {}

  ngOnInit() {
    this.loadGoogleMaps().then(() => {
      // Google Maps API is loaded, you can initialize your map here
    });
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.configService.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = (error: any) => {
        reject(error);
      };
      document.head.appendChild(script);
    });
  }
}
