import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousDetailsComponent } from './previous-details.component';

describe('PreviousDetailsComponent', () => {
  let component: PreviousDetailsComponent;
  let fixture: ComponentFixture<PreviousDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
