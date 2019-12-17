import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonEditDialogComponent } from './season-edit-dialog.component';

describe('SeasonEditDialogComponent', () => {
  let component: SeasonEditDialogComponent;
  let fixture: ComponentFixture<SeasonEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
