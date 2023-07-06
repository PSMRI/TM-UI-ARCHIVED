import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmLogoutComponent } from './tm-logout.component';

describe('TmLogoutComponent', () => {
  let component: TmLogoutComponent;
  let fixture: ComponentFixture<TmLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
