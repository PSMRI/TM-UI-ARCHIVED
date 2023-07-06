import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcdScreeningDiagnosisComponent } from './ncd-screening-diagnosis.component';

describe('NcdScreeningDiagnosisComponent', () => {
  let component: NcdScreeningDiagnosisComponent;
  let fixture: ComponentFixture<NcdScreeningDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcdScreeningDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcdScreeningDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
