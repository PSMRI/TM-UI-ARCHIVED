import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstetricHistoryComponent } from './obstetric-history.component';

describe('ObstetricHistoryComponent', () => {
  let component: ObstetricHistoryComponent;
  let fixture: ComponentFixture<ObstetricHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstetricHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstetricHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
