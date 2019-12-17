import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCategoriesComponent } from './modify-categories.component';

describe('ModifyCategoriesComponent', () => {
  let component: ModifyCategoriesComponent;
  let fixture: ComponentFixture<ModifyCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
