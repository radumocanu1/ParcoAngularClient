export class ListingPaymentRequest {
  title!:string
  price!:number

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}
