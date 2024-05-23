import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListingPaymentRequest} from "../model/ListingPaymentRequest";

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private apiUrl = 'http://localhost:8080/create-checkout-session';

  constructor(private http: HttpClient) { }

  createCheckoutSession(listingPaymentRequest: ListingPaymentRequest): Observable<string> {
    return this.http.post(this.apiUrl,listingPaymentRequest, { responseType: 'text' });
  }
}
