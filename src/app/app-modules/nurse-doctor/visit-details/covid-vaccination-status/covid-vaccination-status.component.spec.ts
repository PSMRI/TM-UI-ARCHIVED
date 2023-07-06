import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidVaccinationStatusComponent } from './covid-vaccination-status.component';

describe('CovidVaccinationStatusComponent', () => {
  let component: CovidVaccinationStatusComponent;
  let fixture: ComponentFixture<CovidVaccinationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidVaccinationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidVaccinationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
