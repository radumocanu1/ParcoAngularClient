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
  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private userService: UserService,
    public dialogRef: MatDialogRef<FullImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: string }
  ) {
    this.imageUrl = data.image;
  }
  public closeDialogBox(){
    this.dialogRef.close();

  }

}
