import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RncpTitlesComponent } from './rncp-titles.component';

describe('RncpTitlesComponent', () => {
  let component: RncpTitlesComponent;
  let fixture: ComponentFixture<RncpTitlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RncpTitlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RncpTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
