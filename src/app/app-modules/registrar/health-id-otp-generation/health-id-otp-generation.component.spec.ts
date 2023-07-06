import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthIdOtpGenerationComponent } from './health-id-otp-generation.component';

describe('HealthIdOtpGenerationComponent', () => {
  let component: HealthIdOtpGenerationComponent;
  let fixture: ComponentFixture<HealthIdOtpGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthIdOtpGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthIdOtpGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
