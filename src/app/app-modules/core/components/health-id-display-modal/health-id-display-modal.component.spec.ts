import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthIdDisplayModalComponent } from './health-id-display-modal.component';

describe('HealthIdDisplayModalComponent', () => {
  let component: HealthIdDisplayModalComponent;
  let fixture: ComponentFixture<HealthIdDisplayModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthIdDisplayModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthIdDisplayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
