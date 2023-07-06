import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryPlatformHistoryComponent } from './beneficiary-platform-history.component';

describe('BeneficiaryPlatformHistoryComponent', () => {
  let component: BeneficiaryPlatformHistoryComponent;
  let fixture: ComponentFixture<BeneficiaryPlatformHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiaryPlatformHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryPlatformHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
