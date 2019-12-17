import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestHeaderDialogComponent } from './test-header-dialog.component';

describe('TestHeaderDialogComponent', () => {
  let component: TestHeaderDialogComponent;
  let fixture: ComponentFixture<TestHeaderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestHeaderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHeaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
