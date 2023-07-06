import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCaseRecordComponent } from './general-case-record.component';

describe('GeneralCaseRecordComponent', () => {
  let component: GeneralCaseRecordComponent;
  let fixture: ComponentFixture<GeneralCaseRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralCaseRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCaseRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
