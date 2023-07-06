import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageToCanvasComponent } from './image-to-canvas.component';

describe('ImageToCanvasComponent', () => {
  let component: ImageToCanvasComponent;
  let fixture: ComponentFixture<ImageToCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageToCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageToCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
