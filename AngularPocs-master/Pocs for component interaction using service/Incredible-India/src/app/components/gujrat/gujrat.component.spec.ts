import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GujratComponent } from './gujrat.component';

describe('GujratComponent', () => {
  let component: GujratComponent;
  let fixture: ComponentFixture<GujratComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GujratComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GujratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
