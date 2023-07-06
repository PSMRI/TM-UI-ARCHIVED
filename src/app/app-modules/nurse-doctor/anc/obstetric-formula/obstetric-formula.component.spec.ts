import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstetricFormulaComponent } from './obstetric-formula.component';

describe('ObstetricFormulaComponent', () => {
  let component: ObstetricFormulaComponent;
  let fixture: ComponentFixture<ObstetricFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstetricFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstetricFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
