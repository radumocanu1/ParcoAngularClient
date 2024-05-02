export class Listing {
  listingUUID: string;
  pictures: { pictureUUID: string, picturePath: string }[];
  title: string;
  latitude: string;
  longitude: string;
  startDate: string;
  endDate: string;
  parkingSpotSlotNumber: number;
  publishingDate: string;
  price: number;

  constructor(
    listingUUID: string,
    pictures: { pictureUUID: string, picturePath: string }[],
    title: string,
    latitude: string,
    longitude: string,
    startDate: string,
    endDate: string,
    parkingSpotSlotNumber: number,
    publishingDate: string,
    price: number
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
  }
}
