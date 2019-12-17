import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RajasthanComponent } from './rajasthan.component';

describe('RajasthanComponent', () => {
  let component: RajasthanComponent;
  let fixture: ComponentFixture<RajasthanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RajasthanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RajasthanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
