import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ImagePreviewComponent} from "../../image-preview/image-preview.component";
import {FullImageModalComponent} from "../../full-image-modal/full-image-modal.component";


@Injectable({
  providedIn: 'root'
})
export class ImageViewService {

  constructor(private dialog: MatDialog) { }
  openPreviewModal(image: File) {
    this.dialog.open(ImagePreviewComponent, {
      data: { image },
      width: '500px'
    });

  }
  openFullImageModal(image: string) {
    this.dialog.open(FullImageModalComponent, {
      data: { image },
      height: 'auto',
      width: 'auto',
    });

  }


}
