export class ListingRequest {
  title!: string ;
  latitude!: string;
  longitude!: string;
  startDate!: string;
  endDate!: string;
  parkingSpotSlotNumber!: number;
  price!: number;
  sector!: number;
  location!: string;
  description!: string;
  longTermRent!: boolean;
  monthlyPrice!: number;
  available: boolean = true

}

