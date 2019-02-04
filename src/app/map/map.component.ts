import {Component} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  lat: number = 49.9935;
  lng: number = 36.230382999999996;

  constructor() {

  }
}
