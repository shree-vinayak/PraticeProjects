import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDocumentComponent } from './test-document.component';

describe('TestDocumentComponent', () => {
  let component: TestDocumentComponent;
  let fixture: ComponentFixture<TestDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
