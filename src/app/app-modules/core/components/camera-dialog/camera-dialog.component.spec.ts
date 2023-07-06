import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraDialogComponent } from './camera-dialog.component';

describe('CameraDialogComponent', () => {
  let component: CameraDialogComponent;
  let fixture: ComponentFixture<CameraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
