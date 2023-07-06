import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDemographicDetailsComponent } from './register-demographic-details.component';

describe('RegisterDemographicDetailsComponent', () => {
  let component: RegisterDemographicDetailsComponent;
  let fixture: ComponentFixture<RegisterDemographicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterDemographicDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterDemographicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
