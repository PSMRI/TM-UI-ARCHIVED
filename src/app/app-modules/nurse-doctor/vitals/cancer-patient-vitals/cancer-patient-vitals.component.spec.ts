import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancerPatientVitalsComponent } from './cancer-patient-vitals.component';

describe('CancerPatientVitalsComponent', () => {
  let component: CancerPatientVitalsComponent;
  let fixture: ComponentFixture<CancerPatientVitalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancerPatientVitalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancerPatientVitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
