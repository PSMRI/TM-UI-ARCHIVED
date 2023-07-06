import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PncCaseSheetComponent } from './pnc-case-sheet.component';

describe('PncCaseSheetComponent', () => {
  let component: PncCaseSheetComponent;
  let fixture: ComponentFixture<PncCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PncCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PncCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
