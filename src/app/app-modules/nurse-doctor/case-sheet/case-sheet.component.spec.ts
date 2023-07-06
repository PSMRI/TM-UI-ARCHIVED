import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSheetComponent } from './case-sheet.component';

describe('CaseSheetComponent', () => {
  let component: CaseSheetComponent;
  let fixture: ComponentFixture<CaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
