import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListingRequest} from "../model/ListingRequest";
import {Listing} from "../model/Listing";
import {MinimalListing} from "../model/MinimalListing";

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = 'http://localhost:8080/listing';

  constructor(private http: HttpClient) { }

  getListing(listingId: string| null): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/' + listingId);
  }
  getMyListings(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/userListings');
  }
  createListing(listingRequest:ListingRequest): Observable<any> {
    return this.http.post<Listing>(this.apiUrl , listingRequest);
  }
  getAllListings(): Observable<MinimalListing[]> {
    return this.http.get<MinimalListing[]>(this.apiUrl);
  }
  getFilteredListings(filter: any): Observable<MinimalListing[]> {
    return this.http.get<MinimalListing[]>(`${this.apiUrl}/filtered`, { params: filter });
  }
  addPhotoToListing(listingUUID: string, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.patch(`${this.apiUrl}/picture/${listingUUID}`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
  }
  addMainPhotoToListing(listingUUID: string, file: File | null): Observable<string> {
    const formData: FormData = new FormData();
    // @ts-ignore
    formData.append('file', file);
    return this.http.patch(`${this.apiUrl}/main-picture/${listingUUID}`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
  }

}
