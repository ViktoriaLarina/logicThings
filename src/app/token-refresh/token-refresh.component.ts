import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CoreAuthService} from '../core-module/servises/core.auth.service';

@Component({
  selector: 'app-ref',
  templateUrl: './token-refresh.component.html',
})
export class RefComponent  implements OnInit {
  constructor(private httpService: CoreAuthService, private router: Router) {
  }
  ngOnInit() {
    this.httpService.tokenRefresh().subscribe((success) => {
      if (success) {
        this.router.navigate(['/home']);
      }
    });
  }
}
