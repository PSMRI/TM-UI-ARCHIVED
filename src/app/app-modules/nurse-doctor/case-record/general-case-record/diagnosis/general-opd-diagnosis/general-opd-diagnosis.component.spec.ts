import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralOpdDiagnosisComponent } from './general-opd-diagnosis.component';

describe('GeneralOpdDiagnosisComponent', () => {
  let component: GeneralOpdDiagnosisComponent;
  let fixture: ComponentFixture<GeneralOpdDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralOpdDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralOpdDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
