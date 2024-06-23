import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {SnackbarService} from "../service/util/SnackbarService";
import {UserService} from "../service/UserService";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {KeycloakService} from "keycloak-angular";
import {AppConfigService} from "../service/AppConfigService";
import {ChatService} from "../service/ChatService";

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {
  confirmText: string = '';
  websiteDomain:string


  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private chatService: ChatService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    public dialogRef: MatDialogRef<DeleteAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appConfig: AppConfigService
  ) {
    this.websiteDomain = this.appConfig.websiteDomain;

  }
  // TODO try to see if there is a way to show this
  openSnackBar() {
    this.snackbarService.openSnackBar(' Contul dumneavoastra a fost sters! ');
  }

  public closeDialogBox(){
    this.dialogRef.close();
  }
  public deleteAccount(): void {
    this.chatService.deleteAllUserChats().subscribe(
      () => {
        this.userService.deleteUser().subscribe({
          next: (event: any) => {
            this.closeDialogBox()
            this.openSnackBar();
            // workaround to revoke current access token
            this.keycloakService.logout(`${this.websiteDomain}/register`).then(() => {
              console.log("Logout successful");
            }).catch((error: any) => {
              console.error("Logout failed:", error);
            });
          }
        })
      }
    )

  }

}
