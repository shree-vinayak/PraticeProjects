import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholerSeasonComponent } from './scholer-season.component';

describe('ScholerSeasonComponent', () => {
  let component: ScholerSeasonComponent;
  let fixture: ComponentFixture<ScholerSeasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScholerSeasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholerSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
