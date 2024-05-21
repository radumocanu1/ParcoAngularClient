import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {MessageRequest} from "../model/MessageRequest";
import {Chat} from "../model/Chat";
import {catchError, Observable} from "rxjs";
import {ChatResponse} from "../model/ChatResponse";

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
  public createChat(otherUserID:String):Observable<ChatResponse>{
    console.log("creating chat..")
    return this.http.post<ChatResponse>(`${this.chatUrl}/${otherUserID}`,{});
  }
  // public getAllUserChats():Observable<ChatResponse>{
  //   console.log("creating chat..")
  //   return this.http.post<ChatResponse>(`${this.chatUrl}/${otherUserID}`,{});
  // }


}
