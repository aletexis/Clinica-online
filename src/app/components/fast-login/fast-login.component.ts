import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fast-login',
  templateUrl: './fast-login.component.html',
  styleUrls: ['./fast-login.component.css']
})
export class FastLoginComponent implements OnInit {

  @Input() user: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
