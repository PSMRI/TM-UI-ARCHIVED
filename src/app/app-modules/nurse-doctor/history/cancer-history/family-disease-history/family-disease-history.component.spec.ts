import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDiseaseHistoryComponent } from './family-disease-history.component';

describe('FamilyDiseaseHistoryComponent', () => {
  let component: FamilyDiseaseHistoryComponent;
  let fixture: ComponentFixture<FamilyDiseaseHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyDiseaseHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDiseaseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
