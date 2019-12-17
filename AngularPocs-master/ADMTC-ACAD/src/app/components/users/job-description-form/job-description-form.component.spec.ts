import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionFormComponent } from './job-description-form.component';

describe('JobDescriptionFormComponent', () => {
  let component: JobDescriptionFormComponent;
  let fixture: ComponentFixture<JobDescriptionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDescriptionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
