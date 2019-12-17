import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTestNotificationDialogComponent } from './group-test-notification-dialog.component';

describe('GroupTestNotificationDialogComponent', () => {
  let component: GroupTestNotificationDialogComponent;
  let fixture: ComponentFixture<GroupTestNotificationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTestNotificationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTestNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
