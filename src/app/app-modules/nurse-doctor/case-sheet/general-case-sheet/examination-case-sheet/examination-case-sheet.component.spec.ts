import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationCaseSheetComponent } from './examination-case-sheet.component';

describe('ExaminationCaseSheetComponent', () => {
  let component: ExaminationCaseSheetComponent;
  let fixture: ComponentFixture<ExaminationCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminationCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
