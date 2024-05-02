import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {UserService} from "../service/UserService";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent implements OnInit {
  currentFile?: File;
  message = '';
  preview = '';

  imageInfos?: Observable<any>;

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    // this.imageInfos = this.uploadService.getFiles();
  }
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }
  upload(): void {
    if (this.currentFile) {
      this.userService.changeProfilePic(this.currentFile).subscribe({
        next: (event: any) => {
          console.log(event)
          if (event instanceof HttpResponse) {
            this.message = event.body.message;
            // this.imageInfos = this.uploadService.getFiles();
          }
        },
        error: (err: any) => {
          console.log(err);

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Imaginea nu a putut fi incarcata!';
          }
        },
        complete: () => {
          this.currentFile = undefined;
        }
      });
    }
  }

}
