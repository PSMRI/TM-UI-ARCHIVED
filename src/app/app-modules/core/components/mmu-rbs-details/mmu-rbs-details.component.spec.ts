import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmuRbsDetailsComponent } from './mmu-rbs-details.component';

describe('MmuRbsDetailsComponent', () => {
  let component: MmuRbsDetailsComponent;
  let fixture: ComponentFixture<MmuRbsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmuRbsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmuRbsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
