import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-device-delete-dialog',
  templateUrl: './device-confirm-delete.component.html'
})
export class DeviceDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeviceDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }
}
