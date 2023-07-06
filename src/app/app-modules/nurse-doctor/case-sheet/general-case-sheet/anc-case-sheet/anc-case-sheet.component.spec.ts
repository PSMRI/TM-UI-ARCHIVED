import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AncCaseSheetComponent } from './anc-case-sheet.component';

describe('AncCaseSheetComponent', () => {
  let component: AncCaseSheetComponent;
  let fixture: ComponentFixture<AncCaseSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AncCaseSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AncCaseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
