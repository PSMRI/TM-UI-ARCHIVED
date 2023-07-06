import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancerCaseRecordComponent } from './cancer-case-record.component';

describe('CancerCaseRecordComponent', () => {
  let component: CancerCaseRecordComponent;
  let fixture: ComponentFixture<CancerCaseRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancerCaseRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancerCaseRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
