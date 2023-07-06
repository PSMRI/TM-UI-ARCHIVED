import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDiagnosisCaseSheetComponent } from './doctor-diagnosis-case-sheet.component';

describe('DoctorDiagnosisCaseSheetComponent', () => {
  let component: DoctorDiagnosisCaseSheetComponent;
  let fixture: ComponentFixture<DoctorDiagnosisCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorDiagnosisCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorDiagnosisCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
