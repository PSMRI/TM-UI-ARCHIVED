import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OncologistWorklistComponent } from './oncologist-worklist.component';

describe('OncologistWorklistComponent', () => {
  let component: OncologistWorklistComponent;
  let fixture: ComponentFixture<OncologistWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OncologistWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OncologistWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
