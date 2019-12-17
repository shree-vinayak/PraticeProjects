import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowstudentComponent } from './showstudent.component';

describe('ShowstudentComponent', () => {
  let component: ShowstudentComponent;
  let fixture: ComponentFixture<ShowstudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowstudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
