import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpectedDocumentDialogComponent } from './add-expected-document-dialog.component';

describe('AddExpectedDocumentDialogComponent', () => {
  let component: AddExpectedDocumentDialogComponent;
  let fixture: ComponentFixture<AddExpectedDocumentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExpectedDocumentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpectedDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
