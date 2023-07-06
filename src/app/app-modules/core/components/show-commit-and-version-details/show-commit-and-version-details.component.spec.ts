import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCommitAndVersionDetailsComponent } from './show-commit-and-version-details.component';

describe('ShowCommitAndVersionDetailsComponent', () => {
  let component: ShowCommitAndVersionDetailsComponent;
  let fixture: ComponentFixture<ShowCommitAndVersionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCommitAndVersionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCommitAndVersionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
