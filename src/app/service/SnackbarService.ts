import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(public snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    this.openSnackBarWithAction(message, 'Ok');
  }

  openSnackBarWithAction(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });

  }
}
