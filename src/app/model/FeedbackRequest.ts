export class FeedbackRequest {
  message!:string;
  ratingGiven!:number;

  constructor(message: string, ratingGiven: number) {
    this.message = message;
    this.ratingGiven = ratingGiven;
  }
}
