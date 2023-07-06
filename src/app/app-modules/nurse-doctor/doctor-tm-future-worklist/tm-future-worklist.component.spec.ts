import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmFutureWorklistComponent } from './tm-future-worklist.component';

describe('TmFutureWorklistComponent', () => {
  let component: TmFutureWorklistComponent;
  let fixture: ComponentFixture<TmFutureWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmFutureWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmFutureWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
