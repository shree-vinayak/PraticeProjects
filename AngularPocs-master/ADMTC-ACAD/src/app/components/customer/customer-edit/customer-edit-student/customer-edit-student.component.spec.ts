import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEditStudentComponent } from './customer-edit-student.component';

describe('CustomerEditStudentComponent', () => {
  let component: CustomerEditStudentComponent;
  let fixture: ComponentFixture<CustomerEditStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEditStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEditStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
