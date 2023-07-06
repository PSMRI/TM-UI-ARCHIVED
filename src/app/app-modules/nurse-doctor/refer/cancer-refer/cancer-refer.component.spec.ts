import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancerReferComponent } from './cancer-refer.component';

describe('CancerReferComponent', () => {
  let component: CancerReferComponent;
  let fixture: ComponentFixture<CancerReferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancerReferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancerReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
