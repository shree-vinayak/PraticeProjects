import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertFunctionalityComponent } from './alert-functionality.component';

describe('AlertFunctionalityComponent', () => {
  let component: AlertFunctionalityComponent;
  let fixture: ComponentFixture<AlertFunctionalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertFunctionalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertFunctionalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
