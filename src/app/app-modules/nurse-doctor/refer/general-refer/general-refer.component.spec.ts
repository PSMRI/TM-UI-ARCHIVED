import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralReferComponent } from './general-refer.component';

describe('GeneralReferComponent', () => {
  let component: GeneralReferComponent;
  let fixture: ComponentFixture<GeneralReferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralReferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
