import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AncDetailsComponent } from './anc-details.component';

describe('AncDetailsComponent', () => {
  let component: AncDetailsComponent;
  let fixture: ComponentFixture<AncDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AncDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AncDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
