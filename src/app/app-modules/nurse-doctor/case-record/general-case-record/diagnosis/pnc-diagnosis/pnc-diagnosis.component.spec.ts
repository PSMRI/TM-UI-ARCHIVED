import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PncDiagnosisComponent } from './pnc-diagnosis.component';

describe('PncDiagnosisComponent', () => {
  let component: PncDiagnosisComponent;
  let fixture: ComponentFixture<PncDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PncDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PncDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
