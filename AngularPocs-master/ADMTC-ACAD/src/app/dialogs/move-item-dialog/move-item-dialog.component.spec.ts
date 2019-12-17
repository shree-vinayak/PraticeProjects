import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveItemDialogComponent } from './move-item-dialog.component';

describe('MoveItemDialogComponent', () => {
  let component: MoveItemDialogComponent;
  let fixture: ComponentFixture<MoveItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
