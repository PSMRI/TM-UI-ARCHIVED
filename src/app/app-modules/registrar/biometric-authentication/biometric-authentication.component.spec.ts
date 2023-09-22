import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricAuthenticationComponent } from './biometric-authentication.component';

describe('BiometricAuthenticationComponent', () => {
  let component: BiometricAuthenticationComponent;
  let fixture: ComponentFixture<BiometricAuthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiometricAuthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
