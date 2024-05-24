export class ListingPaymentRequest {

  title!:string
  price!:number
  listingUUID!:string
  startDate!:string
  endDate!:string
  carNumber!:string


  constructor(title: string, price: number, listingUUID: string, startDate: string, endDate: string, carNumber: string) {
    this.title = title;
    this.price = price;
    this.listingUUID = listingUUID;
    this.startDate = startDate;
    this.endDate = endDate;
    this.carNumber = carNumber;
  }
}
