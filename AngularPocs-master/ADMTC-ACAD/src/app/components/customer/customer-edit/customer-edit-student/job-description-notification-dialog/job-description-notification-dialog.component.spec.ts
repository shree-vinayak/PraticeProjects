import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionNotificationDialogComponent } from './job-description-notification-dialog.component';

describe('JobDescriptionNotificationDialogComponent', () => {
  let component: JobDescriptionNotificationDialogComponent;
  let fixture: ComponentFixture<JobDescriptionNotificationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDescriptionNotificationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDescriptionNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
