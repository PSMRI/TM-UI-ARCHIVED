import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryMctsCallHistoryComponent } from './beneficiary-mcts-call-history.component';

describe('BeneficiaryMctsCallHistoryComponent', () => {
  let component: BeneficiaryMctsCallHistoryComponent;
  let fixture: ComponentFixture<BeneficiaryMctsCallHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiaryMctsCallHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryMctsCallHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
