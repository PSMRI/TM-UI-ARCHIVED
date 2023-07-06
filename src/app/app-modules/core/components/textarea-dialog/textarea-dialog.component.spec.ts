import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaDialogComponent } from './textarea-dialog.component';

describe('TextareaDialogComponent', () => {
  let component: TextareaDialogComponent;
  let fixture: ComponentFixture<TextareaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextareaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
