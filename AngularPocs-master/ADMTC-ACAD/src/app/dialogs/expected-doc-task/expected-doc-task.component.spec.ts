import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedDocTaskComponent } from './expected-doc-task.component';

describe('ExpectedDocTaskComponent', () => {
  let component: ExpectedDocTaskComponent;
  let fixture: ComponentFixture<ExpectedDocTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedDocTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedDocTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
