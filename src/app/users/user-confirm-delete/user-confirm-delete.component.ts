import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {UserModel} from "../../models/user.model";

@Component({
  selector: 'app-user-confirm-delete',
  templateUrl: './user-confirm-delete.component.html',
  styleUrls: ['./user-confirm-delete.component.css']
})
export class UserConfirmDeleteComponent {

  constructor(public dialogRef: MatDialogRef<UserConfirmDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserModel) { }

}
