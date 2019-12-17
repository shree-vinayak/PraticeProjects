import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnactivatedUsersComponent } from './unactivated-users.component';

describe('UnactivatedUsersComponent', () => {
  let component: UnactivatedUsersComponent;
  let fixture: ComponentFixture<UnactivatedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnactivatedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnactivatedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
