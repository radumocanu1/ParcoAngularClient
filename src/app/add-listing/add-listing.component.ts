import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListingRequest} from "../model/ListingRequest";
import {NgxFileDropEntry} from "ngx-file-drop";
import {ListingService} from "../service/ListingService";
import {Listing} from "../model/Listing";
import {SnackbarService} from "../service/util/SnackbarService";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrl: './add-listing.component.css'
})
export class AddListingComponent implements OnInit {
  listingForm!: FormGroup;
  previewPictures: string[] = [];
  pictures: File[] = [];
  mainPicture: File | null = null;
  mainPictureIndex: number = -1;
  infoPopupVisible: boolean = false;



  mapOptions: google.maps.MapOptions = {
    center: { lat: 44.4286545011596, lng: 26.101418742985853 }, // Coordonate inițiale
    zoom: 12
  };
  marker = {
    position: { lat: 44.43017772710131, lng: -75.6972 },
    options: { draggable: true }
  };

  constructor(private fb: FormBuilder,
              private listingService: ListingService,
              private snackbarService: SnackbarService,
              private router: Router,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.listingForm = this.fb.group({
      pictures: [null, Validators.required],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      parkingSpotSlotNumber: [null, Validators.required],
      price: [null, Validators.required],
      latitude: [ Validators.required],
      longitude: [ Validators.required],
      location: [ '', Validators.required],
      sector: [ Validators.required],
    });

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
  openSnackBar() {
    this.snackbarService.openSnackBar('✨ Anuntul dumneavoastra a fost procesat cu succes! ✨');
  }
  makeMainPicture(index: number): void {
    this.mainPicture = this.pictures[index];
    this.mainPictureIndex = index;
  }

  confirmLocation(): void {
    const { lat, lng } = this.marker.position;
    this.listingForm.patchValue({
      latitude: lat,
      longitude: lng
    });

  }

  onSubmit(): void {
    if (this.listingForm.valid) {
      const listingRequest: ListingRequest = this.listingForm.getRawValue();
      // remove main picture from Pictures list
      this.listingService.createListing(listingRequest).subscribe(
        (data: Listing) => {
          this.pictures.splice(this.mainPictureIndex,1)
          const listingUUID = data.listingUUID;
          this.listingService.addMainPhotoToListing(listingUUID, this.mainPicture).subscribe(
            () => {
            }
          )
          console.log(this.pictures)
          for (let i = 0; i < this.pictures.length; i++) {
            this.listingService.addPhotoToListing(listingUUID,this.pictures[i]).subscribe(
              (data: string) =>{
               console.log(data);
          }
            )
          }
          this.openSnackBar();
          this.router.navigate(['/my-listings']);
        }
      )

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
    if (this.mainPictureIndex == -1){
      this.mainPicture = files[0];
      this.mainPictureIndex = 0
    }
  }
  removePicture(index: number): void {
    // todo handle index change case
    this.previewPictures.splice(index, 1);
    this.pictures.splice(index, 1);

    if (this.mainPictureIndex === index) {
      this.mainPictureIndex = 0;
      if (this.previewPictures.length > 0) {
        this.mainPicture = this.pictures[0];
      }
      else {
        this.mainPicture = null
      }
    }
  }

  showInfoPopup(): void {
    this.infoPopupVisible = true;
  }

  hideInfoPopup(): void {
    this.infoPopupVisible = false;
  }
}
