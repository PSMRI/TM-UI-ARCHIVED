import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcSpecialistWorklistWrapperComponent } from './tc-specialist-worklist-wrapper.component';

describe('TcSpecialistWorklistWrapperComponent', () => {
  let component: TcSpecialistWorklistWrapperComponent;
  let fixture: ComponentFixture<TcSpecialistWorklistWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcSpecialistWorklistWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcSpecialistWorklistWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
