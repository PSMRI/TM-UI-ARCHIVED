import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndRadiologyComponent } from './test-and-radiology.component';

describe('TestAndRadiologyComponent', () => {
  let component: TestAndRadiologyComponent;
  let fixture: ComponentFixture<TestAndRadiologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAndRadiologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndRadiologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
