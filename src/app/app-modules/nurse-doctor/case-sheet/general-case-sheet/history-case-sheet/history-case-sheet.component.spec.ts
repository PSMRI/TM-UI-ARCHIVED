import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCaseSheetComponent } from './history-case-sheet.component';

describe('HistoryCaseSheetComponent', () => {
  let component: HistoryCaseSheetComponent;
  let fixture: ComponentFixture<HistoryCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
