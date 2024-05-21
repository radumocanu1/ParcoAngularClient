import {Message} from "./Message";

export class ChatResponse {
  chatUUID!:string;
  otherUserUUID!:string;
  otherUserProfileImage!:string;
  otherUserName!:string;
  messages!:Message[]
}
