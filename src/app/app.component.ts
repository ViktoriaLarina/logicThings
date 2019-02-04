import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {CoreUsersService} from "./core-module/servises/core.users.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnDestroy {

  isLoading: boolean;
  subscription: Subscription;

  constructor(private usersService: CoreUsersService) {
    this.subscription = this.usersService.isLoadingShow.subscribe((data: boolean) => {
      this.isLoading = data;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
