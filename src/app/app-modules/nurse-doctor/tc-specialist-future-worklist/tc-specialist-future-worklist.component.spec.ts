import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcSpecialistFutureWorklistComponent } from './tc-specialist-future-worklist.component';

describe('TcSpecialistFutureWorklistComponent', () => {
  let component: TcSpecialistFutureWorklistComponent;
  let fixture: ComponentFixture<TcSpecialistFutureWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcSpecialistFutureWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcSpecialistFutureWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
