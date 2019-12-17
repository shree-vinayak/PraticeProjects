import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTestNotificationEditorComponent } from './group-test-notification-editor.component';

describe('GroupTestNotificationEditorComponent', () => {
  let component: GroupTestNotificationEditorComponent;
  let fixture: ComponentFixture<GroupTestNotificationEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTestNotificationEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTestNotificationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
