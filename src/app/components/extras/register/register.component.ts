import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  goTo(place: string) {
    switch (place) {
      case "register-patient":
        this.router.navigateByUrl("register-patient");
        break;

      case "register-specialist":
        this.router.navigateByUrl("register-specialist");
        break;
    }
  }
}