import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateTestDialogComponent } from './duplicate-test-dialog.component';

describe('DuplicateTestDialogComponent', () => {
  let component: DuplicateTestDialogComponent;
  let fixture: ComponentFixture<DuplicateTestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateTestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateTestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
