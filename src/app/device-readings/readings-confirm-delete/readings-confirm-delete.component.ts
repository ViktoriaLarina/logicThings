import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-readings-delete-dialog',
  templateUrl: './readings-confirm-delete.component.html'
})
export class ReadingsDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<ReadingsDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }
}
