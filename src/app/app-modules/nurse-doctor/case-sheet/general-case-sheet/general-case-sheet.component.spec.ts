import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCaseSheetComponent } from './general-case-sheet.component';

describe('GeneralCaseSheetComponent', () => {
  let component: GeneralCaseSheetComponent;
  let fixture: ComponentFixture<GeneralCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
