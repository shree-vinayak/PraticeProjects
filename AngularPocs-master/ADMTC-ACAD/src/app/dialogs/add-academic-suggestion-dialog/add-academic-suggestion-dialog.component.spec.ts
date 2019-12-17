import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAcademicSuggestionDialogComponent } from './add-academic-suggestion-dialog.component';

describe('AddAcademicSuggestionDialogComponent', () => {
  let component: AddAcademicSuggestionDialogComponent;
  let fixture: ComponentFixture<AddAcademicSuggestionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAcademicSuggestionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAcademicSuggestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
