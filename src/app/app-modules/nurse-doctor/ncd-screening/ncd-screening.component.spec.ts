import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcdScreeningComponent } from './ncd-screening.component';

describe('NcdScreeningComponent', () => {
  let component: NcdScreeningComponent;
  let fixture: ComponentFixture<NcdScreeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcdScreeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcdScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
