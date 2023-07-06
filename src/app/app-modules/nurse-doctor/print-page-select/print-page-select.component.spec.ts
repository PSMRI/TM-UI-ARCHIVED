import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPageSelectComponent } from './print-page-select.component';

describe('PrintPageSelectComponent', () => {
  let component: PrintPageSelectComponent;
  let fixture: ComponentFixture<PrintPageSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintPageSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPageSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
