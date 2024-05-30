import {Component, OnInit} from '@angular/core';
import {AppConfigService} from "./service/AppConfigService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Parco';
  constructor(private configService: AppConfigService) {}
  ngOnInit() {
    this.loadGoogleMaps();
  }
  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.configService.googleMapsApiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
