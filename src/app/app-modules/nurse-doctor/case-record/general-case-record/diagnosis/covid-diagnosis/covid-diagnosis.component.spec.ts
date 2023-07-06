import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidDiagnosisComponent } from './covid-diagnosis.component';

describe('CovidDiagnosisComponent', () => {
  let component: CovidDiagnosisComponent;
  let fixture: ComponentFixture<CovidDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
