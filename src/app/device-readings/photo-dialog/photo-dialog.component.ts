import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CoreAbonentsService } from '../../core-module/servises/core.abonents.service';

@Component({
  selector: 'app-photo-dialog',
  templateUrl: './photo-dialog.component.html',
  styleUrls: ['./photo-dialog.component.css'],
})
export class PhotoDialogComponent implements OnInit {
  author: any;
  loaded: boolean;
  photoUrl: string;
  stubUrl: string;

  constructor(public dialogRef: MatDialogRef<PhotoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private abonentsService: CoreAbonentsService) {
    this.photoUrl = '';
    this.stubUrl = '../../../assets/img/photo_stub.png';
    this.loaded = false;
    this.author = {};
  }

  ngOnInit() {
    this.getPhotoForReadings();
    this.getAuthor();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private getAuthor() {
    if (this.data.item.user_id === this.data.user.user_id) {
      this.author = this.data.user;
      return;
    }
    this.abonentsService.getAuthor(this.data.item.user_id).subscribe(
    (success) => {
        this.author = success;
      }
    );
  }

  private getPhotoForReadings() {
    this.loaded = false;
    this.abonentsService.getPhotoForReadings(this.data.node_id, this.data.device_id, this.data.item.sample_id)
      .subscribe(
        (success: any) => {
          this.loaded = true;
          const im: any = document.getElementById('photo');
          im.src = window.URL.createObjectURL(success);
        }, (err: any) => {
          if (err.status === 500) {
            this.loaded = true;
            const im: any = document.getElementById('photo');
            im.src = this.stubUrl;
          }

        });
  }
}
