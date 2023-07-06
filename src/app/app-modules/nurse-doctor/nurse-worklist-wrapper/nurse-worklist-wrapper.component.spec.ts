import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseWorklistWrapperComponent } from './nurse-worklist-wrapper.component';

describe('NurseWorklistWrapperComponent', () => {
  let component: NurseWorklistWrapperComponent;
  let fixture: ComponentFixture<NurseWorklistWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseWorklistWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseWorklistWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
