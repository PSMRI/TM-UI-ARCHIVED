import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPreviousVisitDetailsComponent } from './open-previous-visit-details.component';

describe('OpenPreviousVisitDetailsComponent', () => {
  let component: OpenPreviousVisitDetailsComponent;
  let fixture: ComponentFixture<OpenPreviousVisitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenPreviousVisitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPreviousVisitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
