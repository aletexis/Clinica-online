import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fast-login',
  templateUrl: './fast-login.component.html',
  styleUrls: ['./fast-login.component.css']
})
export class FastLoginComponent implements OnInit {

  @Output() fillFields = new EventEmitter<{ username: string, password: string }>();

  constructor() { }

  ngOnInit(): void {
  }

  autoFillFields(username: string, password: string) {
    this.fillFields.emit({ username: username, password: password });
  }
  
}
