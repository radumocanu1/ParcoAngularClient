import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {MessageRequest} from "../model/MessageRequest";
import {Chat} from "../model/Chat";
import {catchError, Observable} from "rxjs";
import {ChatResponse} from "../model/ChatResponse";
import {MinimalChat} from "../model/MinimalChat";
import {UnreadChat} from "../model/UnreadChat";
import {AdminChat} from "../model/AdminChat";

@Injectable()
export class ChatService {
  private chatUrl:string = "http://localhost:8080/chat";
  constructor(private http:HttpClient) { }
  public sendMessage(chatID: string, messageRequest:MessageRequest): Observable<void>{
    return this.http.post<void>(`${this.chatUrl}/send-message/${chatID}`, messageRequest);
  }
  public getChat(chatID:String):Observable<ChatResponse>{
    return this.http.get<ChatResponse>(`${this.chatUrl}/${chatID}`);
  }
  public sendWelcomeMessage():Observable<void>{
    return this.http.post<void>(`${this.chatUrl}/generic/welcome`, {})
  }
  public getAdminUUID():Observable<AdminChat> {
    return this.http.get<AdminChat>(`${this.chatUrl}/admin`);
  }
  public tryToGetChat(otherUserId:String):Observable<ChatResponse>{
    return this.http.get<ChatResponse>(`${this.chatUrl}/try/${otherUserId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 404){
          return this.createChat(otherUserId);
        }
        throw(error);
      })
    );
  }
  public checkForUnreadMessages():Observable<UnreadChat>{
    return this.http.get<UnreadChat>(`${this.chatUrl}/unread`);
  }
  public createChat(otherUserID:String):Observable<ChatResponse>{
    console.log("creating chat..")
    return this.http.post<ChatResponse>(`${this.chatUrl}/${otherUserID}`,{});
  }
  public getAllUserChats():Observable<MinimalChat[]>{
    return this.http.get<MinimalChat[]>(`${this.chatUrl}/user`,{});
  }


}
