import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSyncLoginComponent } from './data-sync-login.component';

describe('DataSyncLoginComponent', () => {
  let component: DataSyncLoginComponent;
  let fixture: ComponentFixture<DataSyncLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSyncLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSyncLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
