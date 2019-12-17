import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEmployabilitySurveyComponent } from './student-employability-survey.component';

describe('StudentEmployabilitySurveyComponent', () => {
  let component: StudentEmployabilitySurveyComponent;
  let fixture: ComponentFixture<StudentEmployabilitySurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentEmployabilitySurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEmployabilitySurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
