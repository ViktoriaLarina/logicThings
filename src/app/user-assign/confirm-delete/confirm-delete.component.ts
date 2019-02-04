import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-assign-delete-dialog',
  templateUrl: './confirm-delete.component.html'
})
export class AssignDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<AssignDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }
}
