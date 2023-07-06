import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancerDoctorDiagnosisCaseSheetComponent } from './cancer-doctor-diagnosis-case-sheet.component';

describe('CancerDoctorDiagnosisCaseSheetComponent', () => {
  let component: CancerDoctorDiagnosisCaseSheetComponent;
  let fixture: ComponentFixture<CancerDoctorDiagnosisCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancerDoctorDiagnosisCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancerDoctorDiagnosisCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
