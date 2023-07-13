import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  isLoading: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.showSpinner();
  }

  showSpinner() {
    // this.isLoading = true;
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 3000);
  }

  goTo(place: string) {
    switch (place) {
      case "login":
        this.router.navigateByUrl("login");
        break;

      case "register":
        this.router.navigateByUrl("register");
        break;
    }
  }

}
