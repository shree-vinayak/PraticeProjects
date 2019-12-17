import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMentorEvaluationComponent } from './send-mentor-evaluation.component';

describe('SendMentorEvaluationComponent', () => {
  let component: SendMentorEvaluationComponent;
  let fixture: ComponentFixture<SendMentorEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMentorEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMentorEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
