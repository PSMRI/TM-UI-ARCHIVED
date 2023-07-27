/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { FormBuilder, FormGroup, Validators, FormArray, } from '@angular/forms';

export class QuickConsultUtils {

  constructor(private fb: FormBuilder) { }

  initMedicine(): FormGroup {
    return this.fb.group({
      specialInstruction: null,
      drug: null,
      dose: null,
      frequency: null,
      drugForm: null,
      drugDuration: null,
      drugDurationUnit: null,
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      qih: { value: null, disabled: true }
    });
  }

  initChiefComplaint() {
    return this.fb.group({
      chiefComplaint: [null],
      conceptID: [null],
      description: [null],
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createDrugPrescriptionForm() {
    return this.fb.group({
      prescribedDrugs: this.fb.array([])
    })
  }

  initMedicineWithData(prescription, id?: null): FormGroup {
    let unit;
    if (prescription.drugUnit) {
      unit = `${prescription.drugStrength}${prescription.drugUnit}`;
    } else {
      unit = prescription.drugStrength;
    }
    return this.fb.group({

      id: id,
      drugID: prescription.drugID,
      drugName: prescription.drugName,
      drugStrength: unit,
      formName: prescription.formName,
      dose: prescription.dose,
      qtyPrescribed: prescription.qtyPrescribed,
      frequency: prescription.frequency,
      duration: prescription.duration,
      route: prescription.route,
      durationView: `${prescription.duration} ${prescription.unit}`,
      unit: prescription.unit,
      instructions: prescription.instructions,
      sctCode: prescription.sctCode,
      sctTerm: prescription.sctTerm,
      createdBy: prescription.createdBy || undefined,
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      isEDL: prescription.isEDL,
    });
  }

  createQuickConsultForm() {
    return this.fb.group({
      beneficiaryName: { value: null, disabled: true },
      age: { value: null, disabled: true },
      ageVal: { value: null, disabled: true },
      genderName: { value: null, disabled: true },
      genderID: { value: null, disabled: true },
      benVisitID: null,
      // benChiefComplaint: [null, Validators.required  ],
      // description: [null, Validators.required],
      chiefComplaintList: this.fb.array([this.initChiefComplaint()]),
      height_cm: { value: null, disabled: true },
      weight_Kg: { value: null, disabled: true },
      bMI: { value: null, disabled: true },
      temperature: { value: null, disabled: true },
      pulseRate: { value: null, disabled: true },
      sPO2: { value: null, disabled: true },
      respiratoryRate: { value: null, disabled: true },
      systolicBP_1stReading: { value: null, disabled: true },
      diastolicBP_1stReading: { value: null, disabled: true },
      bloodGlucose_Fasting: { value: null, disabled: true },
      bloodGlucose_Random: { value: null, disabled: true },
      bloodGlucose_2hr_PP: { value: null, disabled: true },
      rbsTestResult: { value: null, disabled: false },
      rbsTestRemarks: { value: null, disabled: false },
      clinicalObservation: [null, Validators.required],
      labTestOrders: [],
      radiology: [],
      test: [],
      externalInvestigation: null,
      instruction: null,
      prescription: this.createDrugPrescriptionForm(),
      prescriptionID: null,
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      provisionalDiagnosisList: this.fb.array([this.initProvisionalDiagnosisList()])

    });


  }
  initProvisionalDiagnosisList() {
    return this.fb.group({
      conceptID: [null, Validators.required],
      term: [null, Validators.required],
      viewProvisionalDiagnosisProvided: [null, Validators.required],
    })
  }
}
