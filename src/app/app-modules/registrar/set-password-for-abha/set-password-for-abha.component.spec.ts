import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPasswordForAbhaComponent } from './set-password-for-abha.component';

describe('SetPasswordForAbhaComponent', () => {
  let component: SetPasswordForAbhaComponent;
  let fixture: ComponentFixture<SetPasswordForAbhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPasswordForAbhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordForAbhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
