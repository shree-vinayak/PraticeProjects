import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceJustifiedDialogComponent } from './absence-justified-dialog.component';

describe('AddExpectedDocumentDialogComponent', () => {
  let component: AbsenceJustifiedDialogComponent;
  let fixture: ComponentFixture<AbsenceJustifiedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsenceJustifiedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceJustifiedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
