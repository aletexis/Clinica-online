import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastLoginComponent } from './fast-login.component';

describe('FastLoginComponent', () => {
  let component: FastLoginComponent;
  let fixture: ComponentFixture<FastLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
