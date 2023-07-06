import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseMmuTmReferredWorklistComponent } from './nurse-mmu-tm-referred-worklist.component';

describe('NurseMmuTmReferredWorklistComponent', () => {
  let component: NurseMmuTmReferredWorklistComponent;
  let fixture: ComponentFixture<NurseMmuTmReferredWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseMmuTmReferredWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseMmuTmReferredWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
