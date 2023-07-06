import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirFallbackComponent } from './redir-fallback.component';

describe('RedirFallbackComponent', () => {
  let component: RedirFallbackComponent;
  let fixture: ComponentFixture<RedirFallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirFallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
