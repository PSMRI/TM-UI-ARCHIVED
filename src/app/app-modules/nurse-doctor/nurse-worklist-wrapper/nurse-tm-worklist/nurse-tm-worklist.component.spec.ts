import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseTmWorklistComponent } from './nurse-tm-worklist.component';

describe('NurseTmWorklistComponent', () => {
  let component: NurseTmWorklistComponent;
  let fixture: ComponentFixture<NurseTmWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseTmWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseTmWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
