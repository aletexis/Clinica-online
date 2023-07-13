import { Component, HostBinding, OnInit } from '@angular/core';
import { ChildrenOutletContexts, Router } from '@angular/router';
// import { homesAnimation, slideInAnimation } from 'src/app/animations';
import { slideInAnimation } from 'src/app/animations';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
  // animations: [homesAnimation],
  animations: [],
})
export class DashboardAdminComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {
  }

  // @HostBinding('@homesAnimations')
  // getRouteAnimationData() {
  //   return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
  //     'animation'
  //   ];
  // }

  ngOnInit(): void { }

  logout() {
    this.authService.logout();
  }

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }
}