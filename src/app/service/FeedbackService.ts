import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FeedbackRequest} from "../model/FeedbackRequest";
import {FeedbackResponse} from "../model/FeedbackResponse";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8080/feedback';
  constructor(private http: HttpClient) { }
  addFeedback(feedbackRequest: FeedbackRequest, listingUUID:string): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${this.apiUrl}/${listingUUID}`, feedbackRequest);
  }
}
