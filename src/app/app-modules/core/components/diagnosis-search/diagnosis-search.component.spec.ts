import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisSearchComponent } from './diagnosis-search.component';

describe('DiagnosisSearchComponent', () => {
  let component: DiagnosisSearchComponent;
  let fixture: ComponentFixture<DiagnosisSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosisSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosisSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
