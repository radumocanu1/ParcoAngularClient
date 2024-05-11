import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {DeleteAccountComponent} from "../../delete-account/delete-account.component";

@Injectable({
  providedIn: 'root'
})
export class DeleteAccountService {
  constructor(private dialog: MatDialog) { }
  openPreviewModal() {
    this.dialog.open(DeleteAccountComponent, {
      width: '560px',
      height: '200px'
    });
  }
}
