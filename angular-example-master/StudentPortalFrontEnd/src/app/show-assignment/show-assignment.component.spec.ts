import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAssignmentComponent } from './show-assignment.component';

describe('ShowAssignmentComponent', () => {
  let component: ShowAssignmentComponent;
  let fixture: ComponentFixture<ShowAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
