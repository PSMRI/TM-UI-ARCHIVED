import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTestReportComponent } from './view-test-report.component';

describe('ViewTestReportComponent', () => {
  let component: ViewTestReportComponent;
  let fixture: ComponentFixture<ViewTestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
