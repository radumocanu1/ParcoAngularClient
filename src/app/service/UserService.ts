import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpRequest} from "@angular/common/http";
import {catchError, concatMap, Observable, of, tap} from "rxjs";
import {UserDTO} from "../model/userDTO";
import {User} from "../model/User";
import {UserProfileView} from "../model/UserProfileView";
import {UserProfile} from "../model/UserProfile";
import {MyProfileUpdateRequest} from "../model/MyProfileUpdateRequest";
import {ProfilePictureResponse} from "../model/ProfilePictureResponse";
import {ChatService} from "./ChatService";

@Injectable()
export class UserService {
  //TODO add retry mechanism

  private userUrl: string;

  constructor(private http: HttpClient,
              private chatService: ChatService) {
    this.userUrl = 'http://localhost:8080/user';
  }

  public findAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.userUrl);
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
  public getProfilePicturePath(userUUID: string | null)  : Observable<string> {
    return this.http.get(`${this.userUrl}/profilePic/${userUUID}`, { responseType: 'text' });
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
  public getProfilePictureUrl(profilePictureBytes: string): string {
    return `data:image/jpeg;base64, ${profilePictureBytes}`;
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
