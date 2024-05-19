import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {SnackbarService} from "../service/util/SnackbarService";
import {UserService} from "../service/UserService";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-full-image-modal',
  templateUrl: './full-image-modal.component.html',
  styleUrl: './full-image-modal.component.css'
})
export class FullImageModalComponent {
  imageUrl!: string ;
  dialogStyles!: { [key: string]: string };

  constructor(
    public dialogRef: MatDialogRef<FullImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: string }
  ) {
    this.imageUrl = data.image;
  }
  adjustImageSize(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    const width = imgElement.naturalWidth;
    const height = imgElement.naturalHeight;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculează dimensiunile maxime ale imaginii în funcție de dimensiunile ecranului
    const maxWidth = viewportWidth * 0.9; // 90% din lățimea ecranului
    const maxHeight = viewportHeight * 0.9; // 90% din înălțimea ecranului

    // Calculează dimensiunile reale ale imaginii în funcție de dimensiunile maxime și raportul de aspect
    let newWidth = width;
    let newHeight = height;

    if (width > maxWidth) {
      newWidth = maxWidth;
      newHeight = (maxWidth / width) * height;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = (maxHeight / height) * width;
    }

    // Actualizează stilurile dialogului modal pentru a reflecta dimensiunile optime ale imaginii
    this.dialogStyles = {
      'width': `${newWidth}px`,
      'height': `${newHeight}px`
    };
  }

}
