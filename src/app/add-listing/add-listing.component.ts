import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListingRequest} from "../model/ListingRequest";
import {NgxFileDropEntry} from "ngx-file-drop";

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrl: './add-listing.component.css'
})
export class AddListingComponent implements OnInit {
  listingForm!: FormGroup;
  previewPictures: string[] = [];
  pictures: File[] = [];


  mapOptions: google.maps.MapOptions = {
    center: { lat: 44.4286545011596, lng: 26.101418742985853 }, // Coordonate inițiale
    zoom: 12
  };
  marker = {
    position: { lat: 44.43017772710131, lng: -75.6972 },
    options: { draggable: true }
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.listingForm = this.fb.group({
      pictures: [null, Validators.required],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      parkingSpotSlotNumber: [null, Validators.required],
      price: [null, Validators.required],
      latitude: [ Validators.required],
      longitude: [ Validators.required]
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files) {
      this.listingForm.patchValue({
        pictures: files
      });
    }
  }
  onMapClick(event: google.maps.MapMouseEvent): void {
    const coords = event.latLng;
    if (coords) {
      this.marker.position = { lat: coords.lat(), lng: coords.lng() };
      this.listingForm.patchValue({
        latitude: coords.lat(),
        longitude: coords.lng()
      });
    }
  }

  confirmLocation(): void {
    const { lat, lng } = this.marker.position;
    this.listingForm.patchValue({
      latitude: lat,
      longitude: lng
    });
    console.log(this.listingForm.getRawValue())
  }

  onSubmit(): void {
    if (this.listingForm.valid) {
      const listingRequest: ListingRequest = this.listingForm.getRawValue();
      console.log(listingRequest);
      // Logica de trimitere către backend va fi implementată aici.
    }
  }
  onFileDrop(files: NgxFileDropEntry[]): void {

    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.pictures.push(file);

          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previewPictures.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    }
    this.listingForm.patchValue({
      pictures: this.pictures
    });
  }
  onFileInputChange(event: any): void {
    const files = event.target.files;
    if (files) {
      this.processFiles(files);
    }
  }

  private processFiles(files: File[]): void {
    for (const file of files) {
      this.pictures.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewPictures.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    this.listingForm.patchValue({
      pictures: this.pictures
    });
  }
}
