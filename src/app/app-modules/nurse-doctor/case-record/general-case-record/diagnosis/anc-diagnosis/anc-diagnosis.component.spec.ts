import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AncDiagnosisComponent } from './anc-diagnosis.component';

describe('AncDiagnosisComponent', () => {
  let component: AncDiagnosisComponent;
  let fixture: ComponentFixture<AncDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AncDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AncDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
