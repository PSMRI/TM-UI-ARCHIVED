import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologistWorklistComponent } from './radiologist-worklist.component';

describe('RadiologistWorklistComponent', () => {
  let component: RadiologistWorklistComponent;
  let fixture: ComponentFixture<RadiologistWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologistWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologistWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
