import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FeedbackRequest} from "../model/FeedbackRequest";
import {FeedbackResponse} from "../model/FeedbackResponse";
import {Observable} from "rxjs";
import {AppConfigService} from "./AppConfigService";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl:string;
  constructor(private http: HttpClient,
              private appConfigService: AppConfigService) {
    this.apiUrl = this.appConfigService.apiBaseUrl + "/feedback";

  }
  addFeedback(feedbackRequest: FeedbackRequest, listingUUID:string): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${this.apiUrl}/${listingUUID}`, feedbackRequest);
  }
  getAllListingFeedbacks(listingUUID:String): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponse[]>(`${this.apiUrl}/${listingUUID}`);
  }
  getAllUserFeedbacks(): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponse[]>(`${this.apiUrl}`);
  }
}
