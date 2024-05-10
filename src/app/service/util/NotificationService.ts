import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private imageUploadedSubject = new Subject<void>();
  private message: string = '';

  imageUploaded$ = this.imageUploadedSubject.asObservable();

  constructor() {}

  emitImageUploaded(): void {
    this.imageUploadedSubject.next();
  }

  setMessage(message: string): void {
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }
}
