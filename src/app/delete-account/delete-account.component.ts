import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {SnackbarService} from "../service/util/SnackbarService";
import {UserService} from "../service/UserService";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {
  confirmText: string = '';

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private snackbarService: SnackbarService,
    private userService: UserService,
    public dialogRef: MatDialogRef<DeleteAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  // TODO try to see if there is a way to show this
  openSnackBar() {
    this.snackbarService.openSnackBar(' Contul dumneavoastra a fost sters! ');
  }

  public closeDialogBox(){
    this.dialogRef.close();

  }
  public deleteAccount(): void {
    this.userService.deleteUser().subscribe({
      next: (event: any) => {
        this.closeDialogBox()
        this.openSnackBar();
        // workaround to revoke current access token
        this.keycloakService.logout("http://localhost:4200/register").then(() => {
          console.log("Logout successful");
        }).catch((error: any) => {
          console.error("Logout failed:", error);
        });
      }
    })
  }

}
