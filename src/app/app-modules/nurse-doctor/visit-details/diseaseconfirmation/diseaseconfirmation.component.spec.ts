import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseconfirmationComponent } from './diseaseconfirmation.component';

describe('DiseaseconfirmationComponent', () => {
  let component: DiseaseconfirmationComponent;
  let fixture: ComponentFixture<DiseaseconfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiseaseconfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiseaseconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
