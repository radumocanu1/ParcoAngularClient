import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListingRequest} from "../model/ListingRequest";
import {Listing} from "../model/Listing";
import {MinimalListing} from "../model/MinimalListing";
import {AdvanceFilteringRequest} from "../model/AdvanceFilteringRequest";
import {UserDTO} from "../model/userDTO";
import {AdminUpdateListingRequest} from "../model/AdminUpdateListingRequest";
import {DateRange} from "../model/DateRange";
import {ListingStatusChangeRequest} from "../model/ListingStatusChangeRequest";
import {AppConfigService} from "./AppConfigService";

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl:string

  constructor(private http: HttpClient,
              private appConfigService: AppConfigService) {
    this.apiUrl = this.appConfigService.apiBaseUrl + "/listing";

  }
  getRentedListings(): Observable<MinimalListing[]> {
    return this.http.get<MinimalListing[]>(this.apiUrl + '/rented');
  }
  getUnavailableDates(listingUUID: string): Observable<DateRange[]> {
    return this.http.get<DateRange[]>(`${this.apiUrl}/${listingUUID}/unavailable-dates`);
  }
  getListingsAdmin(): Observable<MinimalListing[]> {
    return this.http.get<MinimalListing[]>(this.apiUrl + '/admin');
  }
  getListing(listingId: string| null): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/' + listingId);
  }

  updateListingStatus(listingUUID: string | undefined, adminUpdateListingRequest: AdminUpdateListingRequest): Observable<void> {
      return this.http.put<any>(this.apiUrl + '/admin/' + listingUUID, adminUpdateListingRequest);
  }
  getFilteredListing(advanceFilteringRequest: AdvanceFilteringRequest): Observable<MinimalListing[]> {
    return this.http.post<MinimalListing[]>(this.apiUrl + '/filter' , advanceFilteringRequest);
  }
  getMyListings(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/myListings');
  }

  getUserListings(userUUID:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/userListings/${userUUID}`);
  }
  createListing(listingRequest:ListingRequest): Observable<any> {
    return this.http.post<Listing>(this.apiUrl , listingRequest);
  }
  getAllListings(): Observable<MinimalListing[]> {
    return this.http.get<MinimalListing[]>(this.apiUrl);
  }

  deleteListing(listingId: string | null): Observable<string> {
    console.log(listingId);
    console.log(`${this.apiUrl}/${listingId}`);
    return this.http.delete<string>(`${this.apiUrl}/${listingId}`);
  }
  updateListingStatusUser(listingUUID:string, listingChangeStatusRequest: ListingStatusChangeRequest) :Observable<Listing> {
    return this.http.patch<Listing>(`${this.apiUrl}/status/${listingUUID}`, listingChangeStatusRequest);
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
    console.log(listingUUID);
    // @ts-ignore
    formData.append('file', file);
    return this.http.patch(`${this.apiUrl}/main-picture/${listingUUID}`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
  }

}
