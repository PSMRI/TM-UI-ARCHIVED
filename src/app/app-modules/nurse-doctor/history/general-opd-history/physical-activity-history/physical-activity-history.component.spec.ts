import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalActivityHistoryComponent } from './physical-activity-history.component';

describe('PhysicalActivityHistoryComponent', () => {
  let component: PhysicalActivityHistoryComponent;
  let fixture: ComponentFixture<PhysicalActivityHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalActivityHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalActivityHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
