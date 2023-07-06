import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyHistoryNcdscreeningComponent } from './family-history-ncdscreening.component';

describe('FamilyHistoryNcdscreeningComponent', () => {
  let component: FamilyHistoryNcdscreeningComponent;
  let fixture: ComponentFixture<FamilyHistoryNcdscreeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyHistoryNcdscreeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyHistoryNcdscreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
