import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, concatMap, Observable, of, tap} from "rxjs";

import {UserProfile} from "../model/UserProfile";
import {MyProfileUpdateRequest} from "../model/MyProfileUpdateRequest";
import {ProfilePictureResponse} from "../model/ProfilePictureResponse";
import {ChatService} from "./ChatService";
import {MinimalUser} from "../model/MinimalUser";
import {AppConfigService} from "./AppConfigService";

@Injectable()
export class UserService {
  //TODO add retry mechanism

  private userUrl: string;

  constructor(private http: HttpClient,
              private chatService: ChatService,
              private appConfigService: AppConfigService) {
    this.userUrl = this.appConfigService.apiBaseUrl + "/user";
  }

  public findMostAppreciatedUsers(): Observable<MinimalUser[]> {
    return this.http.get<MinimalUser[]>(this.userUrl);
  }



  public getUser(userUUID: string | null)  : Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.userUrl}/${userUUID}`);
  }
  public deleteUser()  : Observable<void> {
    return this.http.delete<void>(this.userUrl);
  }
  public updateUser(myProfileUpdateRequest: MyProfileUpdateRequest | undefined)  : Observable<UserProfile> {
    return this.http.put<UserProfile>(this.userUrl, myProfileUpdateRequest);
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.userUrl}/profile`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.createUser();
        }
        throw(error);
      })
    );
  }
  changeProfilePic(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.userUrl}/profilePic`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
  }
  deleteProfilePic(): Observable<string> {
    return this.http.delete(`${this.userUrl}/profilePic`, {
      responseType: 'text'
    });
  }
  public getUserProfileImage(): Observable<ProfilePictureResponse> {
    return this.http.get<ProfilePictureResponse>(`${this.userUrl}/profilePic`);
  }

  private createUser(): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.userUrl, {}).pipe(
      concatMap(user =>
        this.chatService.sendWelcomeMessage().pipe(
          tap(() => console.log('Welcome message sent successfully')),
          // Return the created user after sending the welcome message
          concatMap(() => of(user))
        )
      )
    );
  }
}
