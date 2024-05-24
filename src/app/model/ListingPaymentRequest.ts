export class ListingPaymentRequest {
  constructor(title: string, price: number, listingUUID: string) {
    this.title = title;
    this.price = price;
    this.listingUUID = listingUUID;
  }
  title!:string
  price!:number
  listingUUID!:string


}
