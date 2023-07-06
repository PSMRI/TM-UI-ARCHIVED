import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorTmWorklistWrapperComponent } from './doctor-tm-worklist-wrapper.component';

describe('DoctorTmWorklistWrapperComponent', () => {
  let component: DoctorTmWorklistWrapperComponent;
  let fixture: ComponentFixture<DoctorTmWorklistWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorTmWorklistWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorTmWorklistWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
