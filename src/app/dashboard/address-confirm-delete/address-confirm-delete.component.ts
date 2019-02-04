import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-address-delete-dialog',
  templateUrl: './address-confirm-delete.component.html'
})
export class AddressDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<AddressDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }
}
