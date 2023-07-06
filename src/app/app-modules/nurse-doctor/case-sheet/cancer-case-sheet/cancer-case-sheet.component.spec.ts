import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancerCaseSheetComponent } from './cancer-case-sheet.component';

describe('CancerCaseSheetComponent', () => {
  let component: CancerCaseSheetComponent;
  let fixture: ComponentFixture<CancerCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancerCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancerCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
