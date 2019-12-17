import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfEventsComponent } from './listofevents.component';

describe('ListOfEventsComponent', () => {
  let component: ListOfEventsComponent;
  let fixture: ComponentFixture<ListOfEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
