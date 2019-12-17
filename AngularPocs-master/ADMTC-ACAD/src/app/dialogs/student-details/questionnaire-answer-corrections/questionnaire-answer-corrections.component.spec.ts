import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireAnswerCorrectionsComponent } from './questionnaire-answer-corrections.component';

describe('QuestionnaireAnswerComponent', () => {
  let component: QuestionnaireAnswerCorrectionsComponent;
  let fixture: ComponentFixture<QuestionnaireAnswerCorrectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireAnswerCorrectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireAnswerCorrectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
