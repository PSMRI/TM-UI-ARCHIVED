import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcdCareDiagnosisComponent } from './ncd-care-diagnosis.component';

describe('NcdCareDiagnosisComponent', () => {
  let component: NcdCareDiagnosisComponent;
  let fixture: ComponentFixture<NcdCareDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcdCareDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcdCareDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
