import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListingRequest} from "../model/ListingRequest";
import {Listing} from "../model/Listing";

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = 'http://localhost:8080/listing';

  constructor(private http: HttpClient) { }

  getListing(listingId: string| null): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/' + listingId);
  }
  createListing(listingRequest:ListingRequest): Observable<any> {
    return this.http.post<Listing>(this.apiUrl , listingRequest);
  }
  getAllListings(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
