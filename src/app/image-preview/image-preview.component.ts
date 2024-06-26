import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../service/UserService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarService} from "../service/util/SnackbarService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css'
})
export class ImagePreviewComponent {
  loading: boolean = false;
  imageFile: File | null;
  imageUrl: string | ArrayBuffer | null;
  currentFile?: File;
  message = '';
  preview = '';

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
              private userService: UserService,
    public dialogRef: MatDialogRef<ImagePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: File }
  ) {

    this.imageFile = data.image
    this.imageUrl = null;
    this.readFile(data.image);
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  openSnackBar() {
    this.snackbarService.openSnackBar('✨ Fotografie modificata cu succes! ✨');
  }

  upload(): void {
    this.loading = true
    if (this.imageFile) {
      this.userService.changeProfilePic(this.imageFile).subscribe({
        next: (event: any) => {
          this.openSnackBar()
          // navigating to root to refresh current page
          this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/myProfile']);
          });
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
          this.closeDialogBox()
          window.location.reload()
        }
      });
    }
  }
  public closeDialogBox(){
    this.dialogRef.close();

  }

}
