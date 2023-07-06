import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousSignificiantFindingsComponent } from './previous-significiant-findings.component';

describe('PreviousSignificiantFindingsComponent', () => {
  let component: PreviousSignificiantFindingsComponent;
  let fixture: ComponentFixture<PreviousSignificiantFindingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousSignificiantFindingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousSignificiantFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
