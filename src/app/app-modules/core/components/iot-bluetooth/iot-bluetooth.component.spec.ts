import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IotBluetoothComponent } from './iot-bluetooth.component';

describe('IotBluetoothComponent', () => {
  let component: IotBluetoothComponent;
  let fixture: ComponentFixture<IotBluetoothComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotBluetoothComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotBluetoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
