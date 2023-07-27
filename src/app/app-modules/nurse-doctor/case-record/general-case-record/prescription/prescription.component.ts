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


import { Component, OnInit, Input, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { MasterdataService, DoctorService } from '../../../shared/services';
import { GeneralUtils } from '../../../shared/utility/general-utility';
import { PageEvent } from '@angular/material';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { MdDialog } from '@angular/material';
import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

interface prescribe {
  id: string;
  drugID: string;
  drugName: string;
  drugStrength: string;
  drugUnit: string;
  quantity: string;
  route: string;
  formID: string;
  formName: string;
  qtyPrescribed: string;
  dose: string;
  frequency: string;
  duration: string;
  unit: string;
  instructions: string;
  isEDL: boolean;
  sctCode: string;
  sctTerm: string;

}
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrescriptionComponent implements OnInit, OnDestroy {

  generalUtils = new GeneralUtils(this.fb);
  @ViewChild('prescriptionForm')
  prescriptionForm: NgForm;

  @Input('drugPrescriptionForm')
  drugPrescriptionForm: FormGroup;

  @Input('caseRecordMode')
  caseRecordMode: string;


  createdBy: string;

  pageSize = 5;
  pageEvent: PageEvent;
  pageLimits = [];
  currentPrescription: prescribe = {
    id: null,
    drugID: null,
    drugName: null,
    drugStrength: null,
    drugUnit: null,
    qtyPrescribed: null,
    quantity: null,
    formID: null,
    formName: null,
    route: null,
    dose: null,
    frequency: null,
    duration: null,
    unit: null,
    instructions: null,
    isEDL: false,
    sctCode: null,
    sctTerm: null
  };

  tempDrugName: any;
  tempform: any;

  filteredDrugMaster = [];
  filteredDrugDoseMaster = [];
  subFilteredDrugMaster = [];
  drugMaster: any;
  drugFormMaster: any;
  drugDoseMaster: any;
  drugRouteMaster: any;
  drugFrequencyMaster: any;
  drugDurationMaster = [];
  drugDurationUnitMaster: any;
  edlMaster: any;

  beneficiaryRegID: string;
  visitID: string;
  visitCategory: string;
  current_language_set: any;
  isStockAvalable: string;
  referredVisitCode: any;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private doctorService: DoctorService,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private dialog: MdDialog) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response => this.current_language_set = response);
    this.createdBy = localStorage.getItem('userName');


    if (localStorage.getItem("referredVisitCode")) {
      this.referredVisitCode = localStorage.getItem("referredVisitCode");
    }
    else {
      this.referredVisitCode = "undefined";
    }
    this.setLimits();
    this.makeDurationMaster();
    this.getDoctorMasterData();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnDestroy() {
    if (this.doctorMasterDataSubscription) {
      this.doctorMasterDataSubscription.unsubscribe();
    }
  }



  makeDurationMaster() {
    let i = 1;
    while (i <= 29) {
      this.drugDurationMaster.push(i);
      i++;
    }
  }

  displayFn(option): string | undefined {
    return option ? `${option.itemName} ${option.strength ? option.strength : ''}${option.unitOfMeasurement ? option.unitOfMeasurement  : ''}${option.quantityInHand ? '(' + option.quantityInHand + ')' : ''}` : undefined;
  }

  getFormValueChanged() {
    this.clearCurrentDetails();
    this.getFormDetails();
  }
  getFormDetails() {
    this.drugFormMaster.filter(item => {
      if(item.itemFormName === this.currentPrescription.formName)
      this.currentPrescription.formID = item.itemFormID;
    });
    // if(this.tempform !== null){
    //   this.currentPrescription['formID'] = this.tempform.itemFormID;
    //   this.currentPrescription['formName'] = this.tempform.itemFormName;
    // }
    // this.currentPrescription['formID'] = this.tempform.itemFormID;
    // this.currentPrescription['formName'] = this.tempform.itemFormName;
    
    this.filterDrugMaster();
    this.filterDoseMaster();
  }

  filterDrugMaster() {
    const drugMasterCopy = Object.assign([], this.drugMaster);
    this.filteredDrugMaster = [];
    drugMasterCopy.forEach(element => {
      if (this.currentPrescription.formID === element.itemFormID) {
        // element["isEDL"] = true;
        this.filteredDrugMaster.push(element);
      }
    });
    const drugMasterCopyEdl = Object.assign([], this.edlMaster);
    drugMasterCopyEdl.forEach(element => {
      if (this.currentPrescription.formID === element.itemFormID) {
        element["quantityInHand"] = 0;
        this.filteredDrugMaster.push(element);
      }
    });
    this.subFilteredDrugMaster = this.filteredDrugMaster;
  }
  filterDoseMaster() {
    const drugDoseMasterCopy = Object.assign([], this.drugDoseMaster);
    this.filteredDrugDoseMaster = [];
    drugDoseMasterCopy.forEach(element => {
      if (this.currentPrescription.formID === element.itemFormID) {
        this.filteredDrugDoseMaster.push(element);
      }
    });

  }


  filterMedicine(medicine) {
    console.log('here');

    if (medicine) {
      this.subFilteredDrugMaster = this.filteredDrugMaster.filter(drug => {
        return drug.itemName.toLowerCase().startsWith(medicine.toLowerCase());
      })
    } else {
      this.subFilteredDrugMaster = this.filteredDrugMaster;
    }
  }
  reEnterMedicine() {
    if (this.tempDrugName && this.currentPrescription.drugID) {
      this.tempDrugName = {
        id: this.currentPrescription.id,
        itemName: this.currentPrescription.drugName,
        itemID: this.currentPrescription.drugID,
        quantityInHand: this.currentPrescription.quantity,
        sctCode: this.currentPrescription.sctCode,
        sctTerm: this.currentPrescription.sctTerm,
        strength: this.currentPrescription.drugStrength,
        unitOfMeasurement: this.currentPrescription.drugUnit
      }
    } else if (this.tempDrugName && !this.currentPrescription.drugID) {
      this.tempDrugName = null;
    } else {
      // this.clearCurrentDetails();
      this.getFormDetails();
    }
  }

  selectMedicineObject(event) {
    const option = event.source.value;
    console.log('here', event);
    if (event.isUserInput) {
      if (this.checkNotIssued(option.itemID)) {
        this.currentPrescription['id'] = option.id;
        this.currentPrescription['drugName'] = option.itemName;
        this.currentPrescription['drugID'] = option.itemID;
        this.currentPrescription['quantity'] = option.quantityInHand;
        this.currentPrescription['sctCode'] = option.sctCode;
        this.currentPrescription['sctTerm'] = option.sctTerm;
        this.currentPrescription['drugStrength'] = option.strength;
        this.currentPrescription['drugUnit'] = option.unitOfMeasurement;
        this.currentPrescription['isEDL'] = option.isEDL;
        const typeOfDrug = option.isEDL ? '' : this.current_language_set.nonEDLMedicine
        if (option.quantityInHand == 0) {
          this.confirmationService.confirm('info ' + typeOfDrug, this.current_language_set.stockNotAvailableWouldYouPrescribe + ' ' + option.itemName + ' ' + (option.strength ? option.strength : '') + (option.unitOfMeasurement ? option.unitOfMeasurement : ''))
            .subscribe(res => {
              if (!res) {
                this.tempDrugName = null;
                this.currentPrescription['id'] = null;
                this.currentPrescription['drugName'] = null;
                this.currentPrescription['drugID'] = null;
                this.currentPrescription['quantity'] = null;
                this.currentPrescription['sctCode'] = null;
                this.currentPrescription['sctTerm'] = null;
                this.currentPrescription['drugStrength'] = null;
                this.currentPrescription['drugUnit'] = null;
                this.isStockAvalable = "";
              }
              else {
                this.isStockAvalable = "warn";
              }
            })
        }
        else {
          this.isStockAvalable = "primary";
        }
      }
    }
  }

  checkNotIssued(itemID) {
    const medicineValue = this.drugPrescriptionForm.controls['prescribedDrugs'].value;
    const filteredExisting = medicineValue.filter(meds => meds.drugID === itemID);
    if (filteredExisting.length > 0) {
      this.reEnterMedicine();
      this.confirmationService.alert(this.current_language_set.alerts.info.medicinePrescribe, 'info');
      return false;
    } else {
      return true;
    }
  }

  // clearCurrentDetails() {
  //   this.currentPrescription = {
  //     id: null,
  //     drugID: null,
  //     drugName: null,
  //     drugStrength: null,
  //     drugUnit: null,
  //     quantity: null,
  //     formID: null,
  //     qtyPrescribed: null,
  //     formName: null,
  //     route: null,
  //     dose: null,
  //     frequency: null,
  //     duration: null,
  //     unit: null,
  //     instructions: null,
  //     isEDL: false,
  //     sctCode: null,
  //     sctTerm: null
  //   };
  //   this.tempDrugName = null;
  //   this.prescriptionForm.form.markAsUntouched();
  //   this.isStockAvalable = "";
  // }
  clearCurrentDetails() {
    // this.currentPrescription = {
    //   id: null,
    //   drugID: null,
    //   drugName: null,
    //   drugStrength: null,
    //   drugUnit: null,
    //   quantity: null,
    //   formID: null,
    //   qtyPrescribed: null,
    //   formName: null,
    //   route: null,
    //   dose: null,
    //   frequency: null,
    //   duration: null,
    //   unit: null,
    //   instructions: null,
    //   isEDL: false,
    //   sctCode: null,
    //   sctTerm: null
    // };
    this.tempDrugName = null;
    this.currentPrescription.dose = null;
    this.currentPrescription.frequency = null;
    this.currentPrescription.duration = null;
    this.currentPrescription.unit = null;
    this.currentPrescription.qtyPrescribed = null;
    this.currentPrescription.route = null;
    this.currentPrescription.instructions = null;
    // this.currentPrescription.formName = null;


    this.prescriptionForm.form.markAsUntouched();
    this.isStockAvalable = "";
  }

  clearCurrentaddDetails() {
    
    this.tempDrugName = null;
    this.currentPrescription.dose = null;
    this.currentPrescription.frequency = null;
    this.currentPrescription.duration = null;
    this.currentPrescription.unit = null;
    this.currentPrescription.qtyPrescribed = null;
    this.currentPrescription.route = null;
    this.currentPrescription.instructions = null;
    this.currentPrescription.formName = null;


    this.prescriptionForm.form.markAsUntouched();
    this.isStockAvalable = "";
  }

  submitForUpload() {
    this.addMedicine();
    // this.tempform = null;
    // this.clearCurrentDetails();
    this.clearCurrentaddDetails();
    // this.currentPrescription = {
    //   id: null,
    //   drugID: null,
    //   drugName: null,
    //   drugStrength: null,
    //   drugUnit: null,
    //   quantity: null,
    //   formID: null,
    //   route: null,
    //   formName: null,
    //   dose: null,
    //   frequency: null,
    //   duration: null,
    //   unit: null,
    //   instructions: null,
    // }
    // this.tempform = null;
    // this.tempDrugName = null;
    // this.prescriptionForm.form.markAsUntouched();
  }


  addMedicine() {
    const medicine: FormArray = <FormArray>this.drugPrescriptionForm.controls['prescribedDrugs'];
    medicine.insert(0,
      this.generalUtils.initMedicineWithData(
        Object.assign({},
          this.currentPrescription,
          { createdBy: this.createdBy })
      )
    );
    console.log(medicine.value, 'frrr')
  }

  setLimits(pageNo = 0) {
    this.pageLimits[0] = +pageNo * +this.pageSize;
    this.pageLimits[1] = (+pageNo + 1) * +this.pageSize;
  }

  deleteMedicine(i, id?: null) {
    this.confirmationService.confirm('warn', this.current_language_set.alerts.info.confirmDelete)
      .subscribe(res => {
        if (res && id) {
          this.deleteMedicineBackend(i, id);
        } else if (res && !id) {
          this.deleteMedicineUI(i);
        }
      });
  }

  deleteMedicineUI(i) {
    const prescribedDrugs = <FormArray>this.drugPrescriptionForm.controls['prescribedDrugs'];
    prescribedDrugs.removeAt(i);
  }
  deleteMedicineBackend(index, id) {
    this.doctorService.deleteMedicine(id)
      .subscribe(res => {
        if (res.statusCode == 200) {
          this.deleteMedicineUI(index);
        }
      })

  }

  prescriptionSubscription: any;
  getPrescriptionDetails(beneficiaryRegID, visitID, visitCategory) {
    this.prescriptionSubscription = this.doctorService.getCaseRecordAndReferDetails(beneficiaryRegID, visitID, visitCategory)
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data && res.data.prescription) {
          const prescription = res.data.prescription;
          this.patchPrescriptionDetails(prescription);
        }
      })
  }
  patchPrescriptionDetails(prescription) {
    console.log(prescription, 'herrrrrrr');
    const medicine: FormArray = <FormArray>this.drugPrescriptionForm.controls['prescribedDrugs'];
    prescription.forEach(element => {
      medicine.insert(0, this.generalUtils.initMedicineWithData(element, element.id));
    });

  }


  doctorMasterDataSubscription: any;
  getDoctorMasterData() {
    this.doctorMasterDataSubscription = this.masterdataService.doctorMasterData$.subscribe(masterData => {
      if (masterData) {
        this.drugFormMaster = masterData.drugFormMaster;
        this.drugMaster = masterData.itemMaster;
        this.drugDoseMaster = masterData.drugDoseMaster;
        this.drugFrequencyMaster = masterData.drugFrequencyMaster;
        this.drugDurationUnitMaster = masterData.drugDurationUnitMaster;
        this.drugRouteMaster = masterData.routeOfAdmin;
        this.edlMaster = masterData.NonEdlMaster;

        if (this.caseRecordMode == 'view') {
          this.beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
          this.visitID = localStorage.getItem('visitID');
          this.visitCategory = localStorage.getItem('visitCategory');
          this.getPrescriptionDetails(this.beneficiaryRegID, this.visitID, this.visitCategory);
        }
      }
    });
  }
  loadMMUPrescription() {
    let reqObj = {
      "benRegID": localStorage.getItem('beneficiaryRegID'),
      "visitCode": localStorage.getItem("referredVisitCode"),
      "benVisitID": localStorage.getItem("referredVisitID"),
      "fetchMMUDataFor": "Prescription"
    }
    if (localStorage.getItem("referredVisitCode") !== "undefined" && localStorage.getItem("referredVisitID") !== "undefined") {
      this.doctorService.getMMUData(reqObj).subscribe((prescriptionDataResponse) => {
        if (prescriptionDataResponse.statusCode == 200) {
          if (prescriptionDataResponse.data.data.length > 0) {
            this.viewMMUPrescriptionDetails(prescriptionDataResponse.data);
          }
          else {
            this.confirmationService.alert(this.current_language_set.mmuPrescriptionDetailsNotAvailable);
          }

        } else {
          console.log("Error in fetching MMU Prescription details");
        }
      }, err => {
        console.log(err.errorMessage);
      })
    }

  }
  viewMMUPrescriptionDetails(prescriptionDataResponse) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': prescriptionDataResponse, title: this.current_language_set.mmuPrescriptionDetails }
    });
  }
  // editMedicine(i, id){
    
  // }

  editMedicine(i, id){
    const prescribedDrugs = <FormArray>(
      this.drugPrescriptionForm.controls["prescribedDrugs"]
    );
    this.currentPrescription.formName = prescribedDrugs.controls[i].value.formName;
    this.getFormDetails();
    this.tempDrugName = prescribedDrugs.controls[i].value.drugName;
    this.currentPrescription.id = prescribedDrugs.controls[i].value.id;
    this.currentPrescription.drugName = prescribedDrugs.controls[i].value.drugName;
    this.currentPrescription.drugID = prescribedDrugs.controls[i].value.drugID;
    this.currentPrescription.quantity = prescribedDrugs.controls[i].value.quantity;
    this.currentPrescription.sctCode = prescribedDrugs.controls[i].value.sctCode;
    this.currentPrescription.sctTerm = prescribedDrugs.controls[i].value.sctTerm;
    this.currentPrescription.drugStrength = prescribedDrugs.controls[i].value.drugStrength;
    this.currentPrescription.drugUnit = prescribedDrugs.controls[i].value.drugUnit;
    this.reEnterMedicine();
    let itemMedicine = this.subFilteredDrugMaster.filter((drug) => {
      if(drug.itemName.toLowerCase() === this.tempDrugName.itemName.toLowerCase()){
        return drug;
      }
      // return drug.itemName.toLowerCase().equals(this.tempDrugName.itemName.toLowerCase());
    });
    console.log("PARTH*****"+itemMedicine[0]);
    this.setMedicineObject(itemMedicine[0]);
    this.currentPrescription.dose = prescribedDrugs.controls[i].value.dose; 
    this.currentPrescription.frequency = prescribedDrugs.controls[i].value.frequency;
    this.currentPrescription.duration = prescribedDrugs.controls[i].value.duration;
    this.currentPrescription.unit = prescribedDrugs.controls[i].value.unit;
    this.currentPrescription.qtyPrescribed = prescribedDrugs.controls[i].value.qtyPrescribed;
    this.currentPrescription.route = prescribedDrugs.controls[i].value.route;
    this.currentPrescription.instructions = prescribedDrugs.controls[i].value.instructions;
    if (id) {
      this.deleteMedicineBackend(i, id);
    } else if (!id) {
      this.deleteMedicineUI(i);
    }


  }

  setMedicineObject(option){
    if (option && option.id && option.itemName && option.itemID && option.quantityInHand && option.sctCode && option.strength && option.unitOfMeasurement && option.isEDL){
      this.currentPrescription["id"] = option.id;
      this.currentPrescription["drugName"] = option.itemName;
    this.currentPrescription["drugID"] = option.itemID;
    this.currentPrescription["quantity"] = option.quantityInHand;
    this.currentPrescription["sctCode"] = option.sctCode;
    this.currentPrescription["sctTerm"] = option.sctTerm;
    this.currentPrescription["drugStrength"] = option.strength;
    this.currentPrescription["drugUnit"] = option.unitOfMeasurement;
    this.currentPrescription["isEDL"] = option.isEDL;
    }
    
    const typeOfDrug = option.isEDL
      ? ""
      : this.current_language_set.nonEDLMedicine;
    if (option.quantityInHand == 0) {

            this.isStockAvalable = "warn";
          }

     else {
      this.isStockAvalable = "primary";
    }
  

}
  

  

}
