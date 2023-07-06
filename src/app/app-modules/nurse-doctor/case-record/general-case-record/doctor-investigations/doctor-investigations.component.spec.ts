import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorInvestigationsComponent } from './doctor-investigations.component';

describe('DoctorInvestigationsComponent', () => {
  let component: DoctorInvestigationsComponent;
  let fixture: ComponentFixture<DoctorInvestigationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorInvestigationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorInvestigationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
