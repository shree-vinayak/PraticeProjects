import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMentorEvalComponent } from './student-mentor-eval.component';

describe('MentorEvalComponent', () => {
  let component: StudentMentorEvalComponent;
  let fixture: ComponentFixture<StudentMentorEvalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentMentorEvalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMentorEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
