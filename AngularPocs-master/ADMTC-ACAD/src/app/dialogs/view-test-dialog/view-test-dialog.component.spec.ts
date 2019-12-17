import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTestDialogComponent } from './view-test-dialog.component';

describe('ViewTestDialogComponent', () => {
  let component: ViewTestDialogComponent;
  let fixture: ComponentFixture<ViewTestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
