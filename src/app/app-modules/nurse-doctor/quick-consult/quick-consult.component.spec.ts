import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickConsultComponent } from './quick-consult.component';

describe('QuickConsultComponent', () => {
  let component: QuickConsultComponent;
  let fixture: ComponentFixture<QuickConsultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickConsultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
