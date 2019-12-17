import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCorrectionDetailDialogComponent } from './test-correction-detail-dialog.component';

describe('TestCorrectionDetailDialogComponent', () => {
  let component: TestCorrectionDetailDialogComponent;
  let fixture: ComponentFixture<TestCorrectionDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCorrectionDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCorrectionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
