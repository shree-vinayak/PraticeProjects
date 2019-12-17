import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertUserResponseDialogComponent } from './alert-user-response-dialog.component';

describe('AlertUserResponseDialogComponent', () => {
  let component: AlertUserResponseDialogComponent;
  let fixture: ComponentFixture<AlertUserResponseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertUserResponseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertUserResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
