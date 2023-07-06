import { async, ComponentFixture, tick, inject, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../core/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GeneralPatientVitalsComponent } from './general-patient-vitals.component';
import { GeneralUtils } from '../../shared/utility';

import { ConfirmationService } from '../../../core/services/confirmation.service';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { NurseService, DoctorService } from '../../shared/services';

import { DoctorServiceStub } from '../../shared/mocks/doctor-service-stub';
import { NurseServiceStub } from '../../shared/mocks/nurse-service-stub';
import { BeneficiaryDetailsServiceStub } from '../../../core/mocks/beneficiary-details-service-stub';

import * as data from '../../shared/mocks/mock-data';
import { Observable } from 'rxjs/Observable';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


describe('GeneralPatientVitalsComponent', () => {
  let component: GeneralPatientVitalsComponent;
  let fixture: ComponentFixture<GeneralPatientVitalsComponent>;
  let beneficiaryDetailsService: any;
  let nurseService: NurseService;
  let doctorService: DoctorService;
  let confirmationService: ConfirmationService;
  let fb;
  let debugElement: DebugElement;
  let el: HTMLElement;
  let spy: any;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralPatientVitalsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, MaterialModule, NoopAnimationsModule],
      providers: [
        ConfirmationService,
        { provide: BeneficiaryDetailsService, useClass: BeneficiaryDetailsServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub }],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPatientVitalsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fb = debugElement.injector.get(FormBuilder);
    // beneficiaryDetailsService = TestBed.get(BeneficiaryDetailsService);
    // doctorService = TestBed.get(DoctorService);
    // confirmationService = TestBed.get(ConfirmationService);
    component.patientVitalsForm = new GeneralUtils(fb).createGeneralVitalDetailsForm();

    fixture.detectChanges();
  });

  it('should create Vitals Component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Vital Component', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should get beneficiary details', () => {
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    expect(component.getBeneficiaryDetails).toHaveBeenCalled();
  });


  it('should call getBeneficiaryDetails on Initialisation', inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    expect(component.getBeneficiaryDetails).toHaveBeenCalled();
  }));

  it('should get age of a beneficiary', inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
  }));

  it('should get check female gender', inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    expect(component.female).toEqual(true);
  }));

  it('should get check female gender', inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    expect(component.female).not.toEqual(true);
  }));

  it('should excute on changes', () => {
    component.ngOnChanges();
    expect(component).toBeTruthy();
  });

  it('should check for visitCategory General OPD and hideForANCAndQC to true and showGlucoseQC to false', () => {
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true);
    expect(component.showGlucoseQC).toEqual(false);
  });

  it('should not show mid upper arm circumference', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true);
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    debugElement = fixture.debugElement.query(By.css('#midUpperArmCircumference_MUAC_cm'));
    expect(debugElement).not.toBeTruthy();
  })));


  it('should not show head circumference', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true);
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    debugElement = fixture.debugElement.query(By.css('#headCircumference_cm'));
    expect(debugElement).not.toBeTruthy();
  })));


  it('should show head circumference', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true);
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#headCircumference_cm'));
    expect(debugElement).toBeTruthy();
  })));

  it('should show mid upper arm circumference', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true);
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#midUpperArmCircumference_MUAC_cm'));
    expect(debugElement).toBeTruthy();
  })));

  it('should not show mid upper arm circumference for ANC', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('ANC');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#midUpperArmCircumference_MUAC_cm'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should not show head circumference for ANC', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('ANC');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#headCircumference_cm'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should not show waistCircumference_cm for ANC', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('ANC');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#waistCircumference_cm'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should not show hipCircumference_cm for ANC', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('ANC');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#hipCircumference_cm'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should not show waistHipRatio for ANC', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('ANC');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#waistHipRatio'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should not show mid upper arm circumference for GOPD (QC)', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#midUpperArmCircumference_MUAC_cm'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should not show head circumference for GOPD (QC)', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#headCircumference_cm'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should not show waistCircumference_cm for GOPD (QC)', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#waistCircumference_cm'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should not show hipCircumference_cm for GOPD (QC)', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#hipCircumference_cm'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should not show waistHipRatio for GOPD (QC)', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#waistHipRatio'));
    expect(debugElement).not.toBeTruthy();
  })));



  it('should show bloodGlucose_Fasting for GOPD (QC)', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false)
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Fasting'));
    expect(debugElement).toBeTruthy();
  })));

  it('should show bloodGlucose_Random for GOPD (QC)', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false)
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Random'));
    expect(debugElement).toBeTruthy();
  })));

  it('should show bloodGlucose_2hr_PP for GOPD (QC)', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false)
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_2hr_PP'));
    expect(debugElement).toBeTruthy();
  })));

  it('should show bloodGlucose_Fasting for ANC', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('ANC');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Fasting'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should show bloodGlucose_Random for ANC', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('ANC');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Random'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should show bloodGlucose_2hr_PP for ANC', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('ANC');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_2hr_PP'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should hide  bloodGlucose_Fasting for General OPD', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Fasting'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should show bloodGlucose_Random for General OPD', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Random'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('should show bloodGlucose_2hr_PP for General OPD', async(inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_2hr_PP'));
    expect(debugElement).not.toBeTruthy();
  })));

  it('Check normal value of height', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    spyOn(component, 'checkHeight');
    component.patientVitalsForm.patchValue({ height_cm: '50' });
    debugElement = fixture.debugElement.query(By.css('#height_cm'));
    debugElement.nativeElement.value = "50";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.height_cm).toEqual('50');
    fixture.detectChanges();
    expect(component.checkHeight).toHaveBeenCalled();
    // spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkHeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).not.toHaveBeenCalled();
  })));

  it('Check Abnormal value of height', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    spyOn(component, 'checkHeight').and.callThrough();
    component.patientVitalsForm.patchValue({ height_cm: 210 });
    debugElement = fixture.debugElement.query(By.css('#height_cm'));
    debugElement.nativeElement.value = "210";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.height_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkHeight).toHaveBeenCalled();
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkHeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check Abnormal value of weight_Kg', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    spyOn(component, 'checkWeight').and.callThrough();
    component.patientVitalsForm.patchValue({ weight_Kg: "210" });
    debugElement = fixture.debugElement.query(By.css('#weight_Kg'));
    debugElement.nativeElement.value = "210";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.weight_Kg).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkWeight).toHaveBeenCalled();
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check Normal value of weight_Kg', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    fixture.detectChanges();
    spyOn(component, 'checkWeight').and.callThrough();
    component.patientVitalsForm.patchValue({ weight_Kg: "50" });
    debugElement = fixture.debugElement.query(By.css('#weight_Kg'));
    debugElement.nativeElement.value = "50";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.weight_Kg).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkWeight).toHaveBeenCalled();
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check hip of female patient hipCircumference_cm', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkHip').and.callThrough();
    component.patientVitalsForm.patchValue({ hipCircumference_cm: "90" });
    debugElement = fixture.debugElement.query(By.css('#hipCircumference_cm'));
    debugElement.nativeElement.value = "90";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.hipCircumference_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkHip).toHaveBeenCalled();
    // fixture.detectChanges();
    console.log(component.female);
    console.log(component.normalHip);
    fixture.detectChanges();
    expect(component.female).toEqual(true);
    expect(component.normalHip).toEqual(false);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check hip of female patient hipCircumference_cm normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    fixture.detectChanges();
    spyOn(component, 'checkHip').and.callThrough();
    component.patientVitalsForm.patchValue({ hipCircumference_cm: "100" });
    debugElement = fixture.debugElement.query(By.css('#hipCircumference_cm'));
    debugElement.nativeElement.value = "100";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.hipCircumference_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkHip).toHaveBeenCalled();
    fixture.detectChanges;
    expect(component.female).toEqual(true);
    console.log(component.female);
    console.log(component.normalHip);
    expect(component.normalHip).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));


  it('Check hip of male patient hipCircumference_cm normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.maleBeneficiary.ageVal);
    expect(component.female).toEqual(false);
    fixture.detectChanges();
    spyOn(component, 'checkHip').and.callThrough();
    component.patientVitalsForm.patchValue({ hipCircumference_cm: "100" });
    debugElement = fixture.debugElement.query(By.css('#hipCircumference_cm'));
    debugElement.nativeElement.value = "100";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.hipCircumference_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkHip).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    console.log(component.normalHip);
    expect(component.female).toEqual(false);
    expect(component.normalHip).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check hip of male patient hipCircumference_cm abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.maleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.maleBeneficiary.ageVal);
    expect(component.female).toEqual(false);
    fixture.detectChanges();
    spyOn(component, 'checkHip').and.callThrough();
    component.patientVitalsForm.patchValue({ hipCircumference_cm: "90" });
    debugElement = fixture.debugElement.query(By.css('#hipCircumference_cm'));
    debugElement.nativeElement.value = "90";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.hipCircumference_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkHip).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    console.log(component.normalHip);
    expect(component.female).toEqual(false);
    expect(component.normalHip).toEqual(false);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));


  it('Check headCircumference_cm for child Abnormal ', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkHeadCircumference').and.callThrough();
    component.patientVitalsForm.patchValue({ headCircumference_cm: "20" });
    debugElement = fixture.debugElement.query(By.css('#headCircumference_cm'));
    debugElement.nativeElement.value = "20";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.headCircumference_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkHeadCircumference).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check midUpperArmCircumference_MUAC_cm for child Abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiaryage_6);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiaryage_6.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkMidUpperArmCircumference').and.callThrough();
    component.patientVitalsForm.patchValue({ midUpperArmCircumference_MUAC_cm: "4" });
    debugElement = fixture.debugElement.query(By.css('#midUpperArmCircumference_MUAC_cm'));
    debugElement.nativeElement.value = "4";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.midUpperArmCircumference_MUAC_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkMidUpperArmCircumference).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check headCircumference_cm for child Normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiary_2);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiary_2.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkHeadCircumference').and.callThrough();
    component.patientVitalsForm.patchValue({ headCircumference_cm: "23" });
    debugElement = fixture.debugElement.query(By.css('#headCircumference_cm'));
    debugElement.nativeElement.value = "23";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.headCircumference_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkHeadCircumference).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check midUpperArmCircumference_MUAC_cm for child Normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiaryage_6);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiaryage_6.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkMidUpperArmCircumference').and.callThrough();
    component.patientVitalsForm.patchValue({ midUpperArmCircumference_MUAC_cm: "7" });
    debugElement = fixture.debugElement.query(By.css('#midUpperArmCircumference_MUAC_cm'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.midUpperArmCircumference_MUAC_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkMidUpperArmCircumference).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check midUpperArmCircumference_MUAC_cm for child Normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiaryage_6);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiaryage_6.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkMidUpperArmCircumference').and.callThrough();
    component.patientVitalsForm.patchValue({ midUpperArmCircumference_MUAC_cm: "7" });
    debugElement = fixture.debugElement.query(By.css('#midUpperArmCircumference_MUAC_cm'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.midUpperArmCircumference_MUAC_cm).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkMidUpperArmCircumference).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check temperature for child Abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiaryage_6);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiaryage_6.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkTemperature').and.callThrough();
    component.patientVitalsForm.patchValue({ temperature: "7" });
    debugElement = fixture.debugElement.query(By.css('#temperature'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.temperature).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkTemperature).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check temperature for child Normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleChildBeneficiaryage_6);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleChildBeneficiaryage_6.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkTemperature').and.callThrough();
    component.patientVitalsForm.patchValue({ temperature: "97" });
    debugElement = fixture.debugElement.query(By.css('#temperature'));
    debugElement.nativeElement.value = "97";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.temperature).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkTemperature).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check pulseRate Abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkPulseRate').and.callThrough();
    component.patientVitalsForm.patchValue({ pulseRate: "7" });
    debugElement = fixture.debugElement.query(By.css('#pulseRate'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.pulseRate).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkPulseRate).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check pulseRate Normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkPulseRate').and.callThrough();
    component.patientVitalsForm.patchValue({ pulseRate: "97" });
    debugElement = fixture.debugElement.query(By.css('#pulseRate'));
    debugElement.nativeElement.value = "97";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.pulseRate).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkPulseRate).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check respiratoryRate Normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkRespiratoryRate').and.callThrough();
    component.patientVitalsForm.patchValue({ respiratoryRate: "97" });
    debugElement = fixture.debugElement.query(By.css('#respiratoryRate'));
    debugElement.nativeElement.value = "97";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.respiratoryRate).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkRespiratoryRate).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check respiratoryRate Abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkRespiratoryRate').and.callThrough();
    component.patientVitalsForm.patchValue({ respiratoryRate: "7" });
    debugElement = fixture.debugElement.query(By.css('#respiratoryRate'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.respiratoryRate).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkRespiratoryRate).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check systolicBP_1stReading Abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkSystolic').and.callThrough();
    component.patientVitalsForm.patchValue({ systolicBP_1stReading: "7" });
    debugElement = fixture.debugElement.query(By.css('#systolicBP_1stReading'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.systolicBP_1stReading).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkSystolic).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check systolicBP_1stReading normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkSystolic').and.callThrough();
    component.patientVitalsForm.patchValue({ systolicBP_1stReading: "97" });
    debugElement = fixture.debugElement.query(By.css('#systolicBP_1stReading'));
    debugElement.nativeElement.value = "97";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.systolicBP_1stReading).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkSystolic).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));


  it('Check diastolicBP_1stReading normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkDiastolic').and.callThrough();
    component.patientVitalsForm.patchValue({ diastolicBP_1stReading: "97" });
    debugElement = fixture.debugElement.query(By.css('#diastolicBP_1stReading'));
    debugElement.nativeElement.value = "97";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.diastolicBP_1stReading).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkDiastolic).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check diastolicBP_1stReading Abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(true)
    expect(component.showGlucoseQC).toEqual(false);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkDiastolic').and.callThrough();
    component.patientVitalsForm.patchValue({ diastolicBP_1stReading: "7" });
    debugElement = fixture.debugElement.query(By.css('#diastolicBP_1stReading'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.diastolicBP_1stReading).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkDiastolic).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check bloodGlucose_Fasting Abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkBloodSugarFasting').and.callThrough();
    component.patientVitalsForm.patchValue({ bloodGlucose_Fasting: "7" });
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Fasting'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.bloodGlucose_Fasting).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkBloodSugarFasting).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check bloodGlucose_Random Abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkBloodSugarRandom').and.callThrough();
    component.patientVitalsForm.patchValue({ bloodGlucose_Random: "7" });
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Random'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.bloodGlucose_Random).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkBloodSugarRandom).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check bloodGlucose_Random Abnormal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false)
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkBloodSugar2HrPostPrandial').and.callThrough();
    component.patientVitalsForm.patchValue({ bloodGlucose_2hr_PP: "7" });
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_2hr_PP'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.bloodGlucose_2hr_PP).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkBloodSugar2HrPostPrandial).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));


  it('Check bloodGlucose_Fasting Normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkBloodSugarFasting').and.callThrough();
    component.patientVitalsForm.patchValue({ bloodGlucose_Fasting: "7" });
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Fasting'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.bloodGlucose_Fasting).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkBloodSugarFasting).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check bloodGlucose_Random Normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkBloodSugarRandom').and.callThrough();
    component.patientVitalsForm.patchValue({ bloodGlucose_Random: "7" });
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_Random'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.bloodGlucose_Random).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkBloodSugarRandom).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('Check bloodGlucose_Random Normal', async(inject([BeneficiaryDetailsService, ConfirmationService], (beneficiaryDetailsService, confirmationService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false)
    expect(component.showGlucoseQC).toEqual(true);
    expect(component.benAge).toEqual(data.femaleBeneficiary.ageVal);
    expect(component.female).toEqual(true);
    fixture.detectChanges();
    spyOn(component, 'checkBloodSugar2HrPostPrandial').and.callThrough();
    component.patientVitalsForm.patchValue({ bloodGlucose_2hr_PP: "7" });
    debugElement = fixture.debugElement.query(By.css('#bloodGlucose_2hr_PP'));
    debugElement.nativeElement.value = "7";
    let el = debugElement.nativeElement as HTMLElement;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.bloodGlucose_2hr_PP).toEqual(debugElement.nativeElement.value);
    fixture.detectChanges();
    expect(component.checkBloodSugar2HrPostPrandial).toHaveBeenCalled();
    fixture.detectChanges;
    console.log(component.female);
    expect(component.female).toEqual(true);
    //  spyOn(confirmationService, 'alert');
    // spyOn(component, 'checkWeight').and.callThrough();
    // fixture.detectChanges();
    // expect(confirmationService.alert).toHaveBeenCalled();
  })));

  it('should get check female gender', inject([BeneficiaryDetailsService], (beneficiaryDetailsService) => {
    beneficiaryDetailsService.beneficiaryDetails.next(data.femaleBeneficiary);
    spyOn(component, 'getBeneficiaryDetails');
    component.ngOnInit();
    expect(component.female).toEqual(true);
  }))

  it('should check for visitCategory  General OPD (QC) and hideForANCAndQC to false and showGlucoseQC to ture', () => {
    component.visitCategory = new String('General OPD (QC)');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false)
    expect(component.showGlucoseQC).toEqual(true);
  });

  it('should check for visitCategory ANC and hideForANCAndQC to false and showGlucoseQC false', () => {
    component.visitCategory = new String('ANC');
    component.ngOnChanges();
    expect(component.hideForANCAndQC).toEqual(false);
    expect(component.showGlucoseQC).toEqual(false);


    it('should get GeneralVitalsData when mode is view', () => {
      spyOn(component, 'getGeneralVitalsData');
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
    });

    it('should get GeneralVitalsData when mode is view and patch height_cm', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.height_cm).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.height_cm);
    })));

    it('should get GeneralVitalsData when mode is view and patch weight_Kg', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.weight_Kg).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.weight_Kg);
    })));

    it('should get GeneralVitalsData when mode is view and patch bMI', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.bMI).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.bMI);
    })));

    it('should get GeneralVitalsData when mode is view and patch waistCircumference_cm', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.waistCircumference_cm).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.waistCircumference_cm);
    })));

    it('should get GeneralVitalsData when mode is view and patch hipCircumference_cm', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.hipCircumference_cm).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.hipCircumference_cm);
    })));

    it('should get GeneralVitalsData when mode is view and patch waistHipRatio', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(+component.patientVitalsForm.value.waistHipRatio).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.waistHipRatio);
    })));

    it('should get GeneralVitalsData when mode is view and patch temperature', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.temperature).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.temperature);
    })));

    it('should get GeneralVitalsData when mode is view and pulseRate', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.pulseRate).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.pulseRate);
    })));

    it('should get GeneralVitalsData when mode is view and patch systolicBP_1stReading', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.systolicBP_1stReading).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.systolicBP_1stReading);
    })));

    it('should get GeneralVitalsData when mode is view and patch diastolicBP_1stReading', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.diastolicBP_1stReading).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.diastolicBP_1stReading);
    })));

    it('should get GeneralVitalsData when mode is view and patch respiratoryRate', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.respiratoryRate).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.respiratoryRate);
    })));

    it('should get GeneralVitalsData when mode is view and patch all fields', async(inject([DoctorService], (doctorService) => {
      localStorage.setItem('visitID', '66');
      localStorage.setItem('beneficiaryRegID', '7416');
      localStorage.setItem('visitCategory', 'General OPD')
      component.visitCategory = 'General OPD';
      spyOn(doctorService, 'getGenericVitals').and.returnValue(Observable.of(data.generalOPDVitalData.data));
      spyOn(component, 'getGeneralVitalsData').and.callThrough();
      component.mode = new String('view');
      component.ngOnChanges();
      expect(component.getGeneralVitalsData).toHaveBeenCalled();
      expect(doctorService.getGenericVitals).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.patientVitalsForm.value.height_cm).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.height_cm);
      expect(component.patientVitalsForm.value.weight_Kg).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.weight_Kg);
      expect(component.patientVitalsForm.value.bMI).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.bMI);
      expect(component.patientVitalsForm.value.waistCircumference_cm).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.waistCircumference_cm);
      expect(component.patientVitalsForm.value.hipCircumference_cm).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.hipCircumference_cm);
      expect(+component.patientVitalsForm.value.waistHipRatio).toEqual(data.generalOPDVitalData.data.benAnthropometryDetail.waistHipRatio);
      expect(component.patientVitalsForm.value.temperature).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.temperature);
      expect(component.patientVitalsForm.value.pulseRate).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.pulseRate);
      expect(component.patientVitalsForm.value.systolicBP_1stReading).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.systolicBP_1stReading);
      expect(component.patientVitalsForm.value.diastolicBP_1stReading).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.diastolicBP_1stReading);
      expect(component.patientVitalsForm.value.respiratoryRate).toEqual(data.generalOPDVitalData.data.benPhysicalVitalDetail.respiratoryRate);
    })));

  });
});