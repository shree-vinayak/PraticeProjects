import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailsDialogComponent } from './document-details-dialog.component';

describe('DocumentDetailsDialogComponent', () => {
  let component: DocumentDetailsDialogComponent;
  let fixture: ComponentFixture<DocumentDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
