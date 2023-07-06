import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { MaterialModule } from '../../../../core/material.module';

import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';
import { BeneficiaryDetailsServiceStub } from '../../../../core/mocks/beneficiary-details-service-stub';

import { CancerUtils } from '../../../shared/utility';

import * as data from '../../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Rx';

import { SignsAndSymptomsComponent } from './signs-and-symptoms.component';

describe('SignsAndSymptomsComponent', () => {
  let component: SignsAndSymptomsComponent;
  let fixture: ComponentFixture<SignsAndSymptomsComponent>;
  let debugElement: any;
  let fb: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, MaterialModule],
      declarations: [SignsAndSymptomsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: BeneficiaryDetailsService, useClass: BeneficiaryDetailsServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignsAndSymptomsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    component.signsForm = new CancerUtils(fb).createSignsForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getBenificiaryDetails on Initialisation', () => {
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    expect(component.getBeneficiaryDetails).toHaveBeenCalled();
  });

  it('should hide lumpInTheBreast symptom for male beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lumpInTheBreast'));
    expect(debugElement).toBeFalsy();
  })));

  it('should hide bloodStainedDischargeFromNipple symptom for male beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodStainedDischargeFromNipple'));
    expect(debugElement).toBeFalsy();
  })));

  it('should hide changeInShapeAndSizeOfBreasts symptom for male beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#changeInShapeAndSizeOfBreasts'));
    expect(debugElement).toBeFalsy();
  })));

  it('should hide vaginalBleedingBetweenPeriods symptom for male beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#vaginalBleedingBetweenPeriods'));
    expect(debugElement).toBeFalsy();
  })));

  it('should hide vaginalBleedingAfterMenopause symptom for male beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#vaginalBleedingAfterMenopause'));
    expect(debugElement).toBeFalsy();
  })));

  it('should hide foulSmellingVaginalDischarge symptom for male beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#foulSmellingVaginalDischarge'));
    expect(debugElement).toBeFalsy();
  })));


  it('should show lumpInTheBreast symptom for female beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#lumpInTheBreast'));
    expect(debugElement).toBeTruthy();
  })));

  it('should show bloodStainedDischargeFromNipple symptom for female beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodStainedDischargeFromNipple'));
    expect(debugElement).toBeTruthy();
  })));

  it('should show changeInShapeAndSizeOfBreasts symptom for female beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#changeInShapeAndSizeOfBreasts'));
    expect(debugElement).toBeTruthy();
  })));

  it('should show vaginalBleedingBetweenPeriods symptom for female beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#vaginalBleedingBetweenPeriods'));
    expect(debugElement).toBeTruthy();
  })));

  it('should not show vaginalBleedingAfterMenopause symptom for female beneficiary less than 30 years', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#vaginalBleedingAfterMenopause'));
    expect(debugElement).toBeFalsy();
  })));

  it('should show foulSmellingVaginalDischarge symptom for female beneficiary', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#foulSmellingVaginalDischarge'));
    expect(debugElement).toBeTruthy();
  })));


});
