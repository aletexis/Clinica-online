import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
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
