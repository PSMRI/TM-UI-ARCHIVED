import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirInComponent } from './redir-in.component';

describe('RedirInComponent', () => {
  let component: RedirInComponent;
  let fixture: ComponentFixture<RedirInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
