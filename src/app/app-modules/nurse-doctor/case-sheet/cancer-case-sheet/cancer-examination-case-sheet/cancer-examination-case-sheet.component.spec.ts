import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancerExaminationCaseSheetComponent } from './cancer-examination-case-sheet.component';

describe('CancerExaminationCaseSheetComponent', () => {
  let component: CancerExaminationCaseSheetComponent;
  let fixture: ComponentFixture<CancerExaminationCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancerExaminationCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancerExaminationCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
