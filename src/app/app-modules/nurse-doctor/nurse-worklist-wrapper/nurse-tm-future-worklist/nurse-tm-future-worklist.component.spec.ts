import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseTmFutureWorklistComponent } from './nurse-tm-future-worklist.component';

describe('NurseTmFutureWorklistComponent', () => {
  let component: NurseTmFutureWorklistComponent;
  let fixture: ComponentFixture<NurseTmFutureWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseTmFutureWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseTmFutureWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
