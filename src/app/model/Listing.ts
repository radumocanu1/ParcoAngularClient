import {MinimalUser} from "./MinimalUser";

export class Listing {
  listingUUID!: string;
  pictures!:Array<any>;
  title!: string;
  latitude!: string;
  longitude!: string;
  startDate!: string;
  endDate!: string;
  parkingSpotSlotNumber!: number;
  publishingDate!: string;
  price!: number;
  sector!: number;
  location!: string
  mainPicture!: any
  minimalUser!: MinimalUser
  myListing!:boolean


}
