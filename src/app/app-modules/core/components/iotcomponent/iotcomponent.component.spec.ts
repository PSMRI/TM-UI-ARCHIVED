import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IotcomponentComponent } from './iotcomponent.component';

describe('IotcomponentComponent', () => {
  let component: IotcomponentComponent;
  let fixture: ComponentFixture<IotcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
