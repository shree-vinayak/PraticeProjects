import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateUsersComponent } from './activate-users.component';

describe('ActivateUsersComponent', () => {
  let component: ActivateUsersComponent;
  let fixture: ComponentFixture<ActivateUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
