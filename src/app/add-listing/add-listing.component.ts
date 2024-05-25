import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListingRequest} from "../model/ListingRequest";
import {NgxFileDropEntry} from "ngx-file-drop";
import {ListingService} from "../service/ListingService";
import {Listing} from "../model/Listing";
import {SnackbarService} from "../service/util/SnackbarService";
import {Router} from "@angular/router";
import {catchError, concatMap, forkJoin, of} from "rxjs";

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrl: './add-listing.component.css'
})

// todo show errors on reactive input
export class AddListingComponent implements OnInit {
  loading: boolean = false;
  previewPictures: string[] = [];
  pictures: File[] = [];
  mainPictureIndex: number = -1;
  infoPopupVisible: boolean = false;
  sectors: number[] = [1, 2, 3, 4, 5, 6];
  longPeriod: boolean = false
  pricePopUpVisible: boolean = false;
  listingForm: FormGroup;
  minEndDate!: Date | null;
  maxEndDate!: Date | null;

  periodPopUpVisible: boolean = false;






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
              private router: Router) {
    this.listingForm = this.fb.group({
      pictures: [null, Validators.required],
      title: ['', [Validators.required, Validators.maxLength(20)]],
      startDate: ['', Validators.required],
      endDate: [''],
      parkingSpotSlotNumber: [null, Validators.min(0)],
      price: [null, Validators.min(0)],
      latitude: [ Validators.required],
      longitude: [ Validators.required],
      location: [ '', [Validators.required, Validators.maxLength(50)]],
      description: [null, [Validators.required,Validators.maxLength(200 )]],
      sector: [ null, Validators.required],
      longTermRent: [false],
      monthlyPrice: [null],
      indefinitePeriod: [false]

    });

  }

  ngOnInit(): void {
    // this.listingForm.get('indefinitePeriod')!.valueChanges.subscribe(value => {
    //   if (value) {
    //     this.listingForm.get('endDate')!.disable();
    //   } else {
    //     this.listingForm.get('endDate')!.enable();
    //   }
    // });

  }
  public toggleLongPeriod(){
    this.longPeriod = !this.longPeriod;
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
  get sector() {
    return this.listingForm.get('sector');
  }
  openSnackBar() {
    this.snackbarService.openSnackBar('✨ Anuntul dumneavoastra a fost procesat cu succes! ✨');
  }
  makeMainPicture(index: number): void {
    this.mainPictureIndex = index;
  }
  todayDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  }
  updateEndDateMinMax(startDate: Date): void {
    if (startDate) {
      const minEndDate = new Date(startDate);
      minEndDate.setDate(minEndDate.getDate() + 1);
      const maxEndDate = new Date(startDate);
      maxEndDate.setFullYear(maxEndDate.getFullYear() + 1);
      this.minEndDate = minEndDate;
      this.maxEndDate = maxEndDate;
    } else {
      this.minEndDate = null;
      this.maxEndDate = null// Reset minEndDate if startDate is null
    }
  }
  confirmLocation(): void {
    console.log(this.listingForm.get("startDate"))

    const { lat, lng } = this.marker.position;
    this.listingForm.patchValue({
      latitude: lat,
      longitude: lng
    });

  }
  onSubmit(): void {
    this.loading = true
    if (this.listingForm.valid) {
      const mainPicture = this.pictures[this.mainPictureIndex]
      this.pictures.splice(this.mainPictureIndex, 1)
      const listingRequest: ListingRequest = this.listingForm.getRawValue();
      if (listingRequest.startDate) {
        listingRequest.startDate = this.convertDateToDDMMYYYY(new Date(listingRequest.startDate));
      }

      if (listingRequest.endDate) {
        listingRequest.endDate = this.convertDateToDDMMYYYY(new Date(listingRequest.endDate));
      }
      listingRequest.available = true
      this.listingService.createListing(listingRequest).pipe(
        concatMap((data: Listing) => {
          const listingUUID = data.listingUUID;

          // Request to add the main photo
          const mainPhotoRequest = this.listingService.addMainPhotoToListing(listingUUID, mainPicture).pipe(
            catchError(error => {
              console.error('Error uploading main photo', error);
              return of(null); // Continue even if there is an error
            })
          );

          // Requests to add the other photos
          const otherPhotosRequests = this.pictures.map(picture =>
            this.listingService.addPhotoToListing(listingUUID, picture).pipe(
              catchError(error => {
                console.error('Error uploading photo', error);
                return of(null); // Continue even if there is an error
              })
            )
          );

          // Use forkJoin to wait for all requests to complete
          return forkJoin([mainPhotoRequest, ...otherPhotosRequests]);
        })
      ).subscribe(() => {
        this.openSnackBar();
        this.router.navigate(['/my-listings']);
      });
    }
    else {
      this.listingForm.markAllAsTouched();

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
  convertDateToDDMMYYYY(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
      this.mainPictureIndex = 0
    }
  }
  removePicture(index: number): void {
    // todo handle index change case
    this.previewPictures.splice(index, 1);
    this.pictures.splice(index, 1);
    // if with a lower index that mainPicture was deleted, make sure mainPicture stays the same
    if (index < this.mainPictureIndex){
      this.mainPictureIndex --
    }

  // if main picture was deleted, make another main picture
    else  if (this.mainPictureIndex === index) {
      this.mainPictureIndex = 0;
    }
  }

  showInfoPopup(): void {
    this.infoPopupVisible = true;
  }

  hideInfoPopup(): void {
    this.infoPopupVisible = false;
  }
  showPricePopup(): void {
    this.pricePopUpVisible = true;
  }
  hidePricePopup(): void {
    this.pricePopUpVisible = false;
  }
  showPeriodPopup(): void {
    this.periodPopUpVisible = true
  }
  hidePeriodPopup(): void {
    this.periodPopUpVisible = false;
  }
}
