import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {MessageRequest} from "../model/MessageRequest";
import {Chat} from "../model/Chat";
import {catchError, Observable} from "rxjs";

@Injectable()
export class ChatService {
  private chatUrl:string = "http://localhost:8080/chat";
  constructor(private http:HttpClient) { }
  public sendMessage(chatID: string, messageRequest:MessageRequest): Observable<String>{
    return this.http.post<String>(`${this.chatUrl}/send-message/${chatID}`, messageRequest);
  }
  public getChat(chatID:String):Observable<Chat>{
    return this.http.get<Chat>(`${this.chatUrl}/${chatID}`);
  }
  public tryToGetChat(otherUserId:String):Observable<Chat>{
    return this.http.get<Chat>(`${this.chatUrl}/try/${otherUserId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 404){
          return this.createChat(otherUserId);
        }
        throw(error);
      })
    );
  }
  public createChat(otherUserID:String):Observable<Chat>{
    console.log("creating chat..")
    return this.http.post<Chat>(`${this.chatUrl}/${otherUserID}`,{});
  }


}
