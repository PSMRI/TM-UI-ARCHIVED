import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AncImmunizationComponent } from './anc-immunization.component';

describe('AncImmunizationComponent', () => {
  let component: AncImmunizationComponent;
  let fixture: ComponentFixture<AncImmunizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AncImmunizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AncImmunizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
