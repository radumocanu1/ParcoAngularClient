import {Status} from "./Status";

  export class MinimalListing {
    listingUUID!: string
    title!: string ;
    mainPicture!: any;
    sector!: number;
    startDate!: Date;
    endDate!: Date;
    price!: number;
    publishingDate!: Date;
    rating!: number
    available!: boolean
    status!:Status



  }
