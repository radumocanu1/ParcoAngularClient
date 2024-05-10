import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ImagePreviewComponent} from "../../image-preview/image-preview.component";


@Injectable({
  providedIn: 'root'
})
export class ImagePreviewService {

  constructor(private dialog: MatDialog) { }
  openPreviewModal(image: File) {
    this.dialog.open(ImagePreviewComponent, {
      data: { image },
      width: '500px'
    });
  }

}
