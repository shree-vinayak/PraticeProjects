import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFooterDialogComponent } from './test-footer-dialog.component';

describe('TestFooterDialogComponent', () => {
  let component: TestFooterDialogComponent;
  let fixture: ComponentFixture<TestFooterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestFooterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFooterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
