import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorWorklistComponent } from './doctor-worklist.component';

describe('DoctorWorklistComponent', () => {
  let component: DoctorWorklistComponent;
  let fixture: ComponentFixture<DoctorWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
