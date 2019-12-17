import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentPopupComponent } from './create-student-popup.component';

describe('CreateStudentPopupComponent', () => {
  let component: CreateStudentPopupComponent;
  let fixture: ComponentFixture<CreateStudentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStudentPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStudentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
