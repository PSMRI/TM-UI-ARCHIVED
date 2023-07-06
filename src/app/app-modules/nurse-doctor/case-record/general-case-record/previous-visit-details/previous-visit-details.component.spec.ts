import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousVisitDetailsComponent } from './previous-visit-details.component';

describe('PreviousVisitDetailsComponent', () => {
  let component: PreviousVisitDetailsComponent;
  let fixture: ComponentFixture<PreviousVisitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousVisitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousVisitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
