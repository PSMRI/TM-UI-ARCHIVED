import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDownloadComponent } from './master-download.component';

describe('MasterDownloadComponent', () => {
  let component: MasterDownloadComponent;
  let fixture: ComponentFixture<MasterDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
