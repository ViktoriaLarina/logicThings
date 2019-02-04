import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-device-additional-data-version',
  templateUrl: './device-additional-data-versions.component.html',
  styleUrls: ['./device-additional-data-versions.component.css']
})
export class DeviceAdditionalDataVersionComponent implements OnInit {
  @Input() deviceValues: any;

  constructor() {
  }

  ngOnInit() {

  }
}
