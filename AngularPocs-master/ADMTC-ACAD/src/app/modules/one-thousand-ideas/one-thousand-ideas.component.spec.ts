import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneThousandIdeasComponent } from './one-thousand-ideas.component';

describe('OneThousandIdeasComponent', () => {
  let component: OneThousandIdeasComponent;
  let fixture: ComponentFixture<OneThousandIdeasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneThousandIdeasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneThousandIdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
