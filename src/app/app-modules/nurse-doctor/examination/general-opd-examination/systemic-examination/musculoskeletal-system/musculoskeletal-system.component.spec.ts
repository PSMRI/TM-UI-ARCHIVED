import { async, ComponentFixture, tick, inject, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../../../core/material.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GeneralUtils } from '../../../../shared/utility';

import * as data from '../../../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Observable';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MasterdataService } from '../../../../shared/services';

import { MasterdataServiceStub } from '../../../../shared/mocks/masterdata-service-stub';
import { MusculoskeletalSystemComponent } from './musculoskeletal-system.component';

describe('MusculoskeletalSystemComponent', () => {
  let component: MusculoskeletalSystemComponent;
  let fixture: ComponentFixture<MusculoskeletalSystemComponent>;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MusculoskeletalSystemComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
      providers: [
        { provide: MasterdataService, useClass: MasterdataServiceStub },]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusculoskeletalSystemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fb = debugElement.injector.get(FormBuilder);
    component.musculoSkeletalSystemForm = new GeneralUtils(fb).createMusculoSkeletalSystemForm();
    fixture.detectChanges();
  });

  it('should create MusculoskeletalSystemComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialize the component', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Should call getMasterData ', async () => {
    spyOn(component, 'getMasterData');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.getMasterData).toHaveBeenCalled();
  });

  it('Should call getMasterData and get master Data ', async(inject([MasterdataService], (masterdataService) => {
    spyOn(component, 'getMasterData').and.callThrough();
    spyOn(masterdataService, 'getNurseMasterData').and.returnValue(Observable.of(data.generalOPDNurseMasterdata.data)).and.callThrough();;
    masterdataService.nurseMasterDataSource.next(data.generalOPDNurseMasterdata.data);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.getMasterData).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.selectTypeOfJoint).toEqual(data.generalOPDNurseMasterdata.data.jointTypes);
  })));

});
