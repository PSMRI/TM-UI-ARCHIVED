import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrsComponent } from './idrs.component';

describe('IdrsComponent', () => {
  let component: IdrsComponent;
  let fixture: ComponentFixture<IdrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
