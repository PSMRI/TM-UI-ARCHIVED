import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMobileOtpGenerationComponent } from './generate-mobile-otp-generation.component';

describe('GenerateMobileOtpGenerationComponent', () => {
  let component: GenerateMobileOtpGenerationComponent;
  let fixture: ComponentFixture<GenerateMobileOtpGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateMobileOtpGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateMobileOtpGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
