export class Listing {
  listingUUID: string;
  pictures:Array<any>;
  title: string;
  latitude: string;
  longitude: string;
  startDate: string;
  endDate: string;
  parkingSpotSlotNumber: number;
  publishingDate: string;
  price: number;
  sector: number;
  location: string
  mainPicture: any

  constructor(
    listingUUID: string,
    pictures: Array<any>,
    title: string,
    latitude: string,
    longitude: string,
    startDate: string,
    endDate: string,
    parkingSpotSlotNumber: number,
    publishingDate: string,
    price: number,
    sector: number,
    location: string,
    mainPicture: any
  ) {
    this.listingUUID = listingUUID;
    this.pictures = pictures;
    this.title = title;
    this.latitude = latitude;
    this.longitude = longitude;
    this.startDate = startDate;
    this.endDate = endDate;
    this.parkingSpotSlotNumber = parkingSpotSlotNumber;
    this.publishingDate = publishingDate;
    this.price = price;
    this.sector = sector;
    this.location = location;
    this.mainPicture = mainPicture;
  }
}
