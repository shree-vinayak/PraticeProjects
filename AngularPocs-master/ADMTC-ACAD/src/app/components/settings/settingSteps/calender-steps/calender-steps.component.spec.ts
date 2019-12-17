import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderStepsComponent } from './calender-steps.component';

describe('CalenderStepsComponent', () => {
  let component: CalenderStepsComponent;
  let fixture: ComponentFixture<CalenderStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalenderStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
