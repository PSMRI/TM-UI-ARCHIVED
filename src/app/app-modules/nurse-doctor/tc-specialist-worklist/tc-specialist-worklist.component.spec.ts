import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcSpecialistWorklistComponent } from './tc-specialist-worklist.component';

describe('TcSpecialistWorklistComponent', () => {
  let component: TcSpecialistWorklistComponent;
  let fixture: ComponentFixture<TcSpecialistWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcSpecialistWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcSpecialistWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
