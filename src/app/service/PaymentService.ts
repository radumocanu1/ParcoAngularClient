import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListingPaymentRequest} from "../model/ListingPaymentRequest";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  createCheckoutSession(listingPaymentRequest: ListingPaymentRequest): Observable<string> {
    return this.http.post(this.baseUrl + '/create-checkout-session',listingPaymentRequest, { responseType: 'text' });
  }
  notifySuccessPayment():Observable<any>{
    return this.http.post(this.baseUrl+'/payment/accept/',{})
  }

  notifyRejectedPayment():Observable<any>{
    return this.http.post(this.baseUrl+'/payment/reject/',{})
  }
}
