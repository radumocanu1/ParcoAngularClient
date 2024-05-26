import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppConfigService} from "../AppConfigService";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl

  constructor(private http: HttpClient,
              private appConfigService: AppConfigService) {
    this.baseUrl = this.appConfigService.apiBaseUrl + "/feedback";
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
