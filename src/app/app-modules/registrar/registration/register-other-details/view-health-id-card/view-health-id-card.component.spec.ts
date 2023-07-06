import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHealthIdCardComponent } from './view-health-id-card.component';

describe('ViewHealthIdCardComponent', () => {
  let component: ViewHealthIdCardComponent;
  let fixture: ComponentFixture<ViewHealthIdCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHealthIdCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHealthIdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
