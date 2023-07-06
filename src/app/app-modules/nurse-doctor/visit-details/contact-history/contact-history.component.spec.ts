import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactHistoryComponent } from './contact-history.component';

describe('ContactHistoryComponent', () => {
  let component: ContactHistoryComponent;
  let fixture: ComponentFixture<ContactHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
