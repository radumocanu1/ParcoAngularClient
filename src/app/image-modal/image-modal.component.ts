import { Component, Input, OnChanges } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {ImageViewService} from "../service/util/ImageViewService";

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnChanges {
  @Input() images: string[] = [];
  currentIndex: number = 0;
  totalImages: number = 0;
  currentImage: string = '';
  imgSrc: string | undefined;
  isFullScreen: boolean = false;
  infoPopupVisible: boolean = false;


  constructor(public bsModalRef: BsModalRef,
              private ImageViewService: ImageViewService) {}

  ngOnChanges(): void {
    this.totalImages = this.images.length;
    this.currentImage = this.images[this.currentIndex];
  }

  nextImage(): void {
    if (this.currentIndex < this.totalImages - 1) {
      this.currentIndex++;
      this.currentImage = this.images[this.currentIndex];
    }
  }

  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentImage = this.images[this.currentIndex];
    }
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  toggleFullScreen(picture:string): void {
    this.ImageViewService.openFullImageModal(picture)
  }
  showInfoPopup(): void {
    this.infoPopupVisible = true;
  }

  hideInfoPopup(): void {
    this.infoPopupVisible = false;
  }
}
