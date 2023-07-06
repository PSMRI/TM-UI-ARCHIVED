import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRadiologyUploadedFilesComponent } from './view-radiology-uploaded-files.component';

describe('ViewRadiologyUploadedFilesComponent', () => {
  let component: ViewRadiologyUploadedFilesComponent;
  let fixture: ComponentFixture<ViewRadiologyUploadedFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRadiologyUploadedFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRadiologyUploadedFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
