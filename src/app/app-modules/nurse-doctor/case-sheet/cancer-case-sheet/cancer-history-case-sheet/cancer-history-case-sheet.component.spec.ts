import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancerHistoryCaseSheetComponent } from './cancer-history-case-sheet.component';

describe('CancerHistoryCaseSheetComponent', () => {
  let component: CancerHistoryCaseSheetComponent;
  let fixture: ComponentFixture<CancerHistoryCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancerHistoryCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancerHistoryCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
