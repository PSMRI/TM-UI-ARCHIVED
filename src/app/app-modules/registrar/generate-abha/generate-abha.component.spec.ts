import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAbhaComponent } from './generate-abha.component';

describe('GenerateAbhaComponent', () => {
  let component: GenerateAbhaComponent;
  let fixture: ComponentFixture<GenerateAbhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateAbhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateAbhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
