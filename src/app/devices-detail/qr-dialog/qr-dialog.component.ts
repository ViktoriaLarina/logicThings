import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-qr-dialog',
  templateUrl: './qr-dialog.component.html',
  styleUrls: ['./qr-dialog.component.css'],
})
export class QrDialogComponent implements AfterViewInit {

  constructor(public dialogRef: MatDialogRef<QrDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  ngAfterViewInit() {
    this.addSN();
  }
  saveQR() {
    const qr: any = document.getElementById('qr');
    const a: any = document.createElement('a');
    a.href = qr.childNodes[0].toDataURL();
    a.download = 'QR-Code_' + this.data.item.serial_number;
    a.click();
  }
  addSN() {
    const qr: any = document.getElementById('qr');
    const ctx = qr.childNodes[0].getContext('2d');
    ctx.font = '40px Roboto';
    ctx.moveTo(0.5, 0); // TODO this must be deleted
    ctx.lineTo(0.5, 539.5); // TODO this must be deleted
    ctx.moveTo(539.5, 0); // TODO this must be deleted
    ctx.lineTo(539.5, 539.5); // TODO this must be deleted
    ctx.moveTo(0.5, 0.5); // TODO this must be deleted
    ctx.lineTo(539.5, 0.5); // TODO this must be deleted
    ctx.moveTo(0.5, 539.5); // TODO this must be deleted
    ctx.lineTo(539.5, 539.5); // TODO this must be deleted
    ctx.moveTo(60, 60); // TODO this must be deleted
    ctx.lineTo(480, 60); // TODO this must be deleted
    ctx.moveTo(60, 480); // TODO this must be deleted
    ctx.lineTo(480, 480); // TODO this must be deleted
    ctx.moveTo(60, 60); // TODO this must be deleted
    ctx.lineTo(60, 480); // TODO this must be deleted
    ctx.moveTo(480, 60); // TODO this must be deleted
    ctx.lineTo(480, 480); // TODO this must be deleted
    ctx.fillText('№ прибора учета: ' + this.data.item.serial_number , 0, 40);
    ctx.fillText(this.data.node.name , 0, 520);
    ctx.strokeStyle = 'black'; // TODO this must be deleted
    ctx.stroke(); // TODO this must be deleted
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
