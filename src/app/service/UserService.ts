import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpRequest} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {UserDTO} from "../model/userDTO";
import {User} from "../model/User";
import {UserProfileView} from "../model/UserProfileView";
import {MyProfile} from "../model/MyProfile";
import {MyProfileUpdateRequest} from "../model/MyProfileUpdateRequest";

@Injectable()
export class UserService {
  //TODO add retry mechanism

  private userUrl: string;

  constructor(private http: HttpClient) {
    this.userUrl = 'http://localhost:8080/user';
  }

  public findAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.userUrl);
  }


  public getUser(userUUID: string | null)  : Observable<UserProfileView> {
    return this.http.get<UserProfileView>(`${this.userUrl}/${userUUID}`);
  }
  public deleteUser()  : Observable<void> {
    return this.http.delete<void>(this.userUrl);
  }
  public updateUser(myProfileUpdateRequest: MyProfileUpdateRequest | undefined)  : Observable<MyProfile> {
    return this.http.put<MyProfile>(this.userUrl, myProfileUpdateRequest);
  }
  public getProfilePicturePath(userUUID: string | null)  : Observable<string> {
    return this.http.get(`${this.userUrl}/profilePic/${userUUID}`, { responseType: 'text' });
  }
  getUserProfile(): Observable<MyProfile> {
    return this.http.get<MyProfile>(`${this.userUrl}/profile`).pipe(
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

  private createUser(): Observable<MyProfile> {
    return this.http.post<MyProfile>(this.userUrl, {});
  }
}
