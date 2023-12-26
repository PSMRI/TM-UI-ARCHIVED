import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdservicebioComponent } from './rdservicebio.component';

describe('RdservicebioComponent', () => {
  let component: RdservicebioComponent;
  let fixture: ComponentFixture<RdservicebioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdservicebioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdservicebioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
