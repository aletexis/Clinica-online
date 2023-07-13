import { ChildrenOutletContexts, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
// import { homesAnimation, slideInAnimation } from './animations';
import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // animations: [slideInAnimation, homesAnimation],
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {

  constructor(private auth: AuthService, public loading: LoadingService, private contexts: ChildrenOutletContexts) { }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }

  ngOnInit() {
    // this.loading.loading = true;
    // setTimeout(() => {
    this.auth.handleStateChange();
    // }, 3000)
  }
}
