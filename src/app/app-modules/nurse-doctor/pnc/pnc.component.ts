import { Component, OnInit, Input, OnChanges, DoCheck } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BeneficiaryDetailsService } from '../../core/services/beneficiary-details.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { MasterdataService, NurseService, DoctorService } from '../shared/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';


@Component({
  selector: 'nurse-pnc',
  templateUrl: './pnc.component.html',
  styleUrls: ['./pnc.component.css']
})
export class PncComponent implements OnInit, DoCheck {

  @Input('patientPNCForm')
  patientPNCForm: FormGroup;

  @Input('mode')
  mode: String;
  currentLanguageSet: any;

  constructor(private fb: FormBuilder,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
    this.getBenificiaryDetails();
    this.today = new Date();
    this.minimumDeliveryDate = new Date(this.today.getTime() - (365 * 24 * 60 * 60 * 1000));
  }

  beneficiaryAge;
  today: Date;
  minimumDeliveryDate: Date;
  dob: Date;

  ngOnChanges() {
    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
    }

    if (this.mode == 'update') {
      this.updatePatientPNC(this.patientPNCForm);
    }
  }

  patchDataToFields(benRegID, visitID) {
    this.doctorService.getPNCDetails(benRegID, visitID).subscribe((pNCdata) => {
      let tempPNCData = Object.assign({}, pNCdata.data.PNCCareDetail);

      if (this.masterData.deliveryTypes) {
        tempPNCData.deliveryType = this.masterData.deliveryTypes.filter((data) => {
          return data.deliveryType == tempPNCData.deliveryType;
        })[0];
      }

      if (this.masterData.deliveryPlaces) {
        tempPNCData.deliveryPlace = this.masterData.deliveryPlaces.filter((data) => {
          return data.deliveryPlace == tempPNCData.deliveryPlace
        })[0];
      }

      if (this.masterData.deliveryComplicationTypes) {
        tempPNCData.deliveryComplication = this.masterData.deliveryComplicationTypes.filter((data) => {
          return data.deliveryComplicationType == tempPNCData.deliveryComplication;
        })[0];
      }

      if (this.masterData.pregOutcomes) {
        tempPNCData.pregOutcome = this.masterData.pregOutcomes.filter((data) => {
          return data.pregOutcome == tempPNCData.pregOutcome;
        })[0];
      }

      if (this.masterData.postNatalComplications) {
        tempPNCData.postNatalComplication = this.masterData.postNatalComplications.filter((data) => {
          return data.complicationValue == tempPNCData.postNatalComplication;
        })[0];
      }

      if (this.masterData.gestation) {
        tempPNCData.gestationName = this.masterData.gestation.filter((data) => {
          return data.name == tempPNCData.gestationName
        })[0]
      }

      if (this.masterData.newbornHealthStatuses) {
        tempPNCData.newBornHealthStatus = this.masterData.newbornHealthStatuses.filter((data) => {
          return data.newBornHealthStatus == tempPNCData.newBornHealthStatus;
        })[0];
      }

      tempPNCData.dDate = new Date(tempPNCData.dateOfDelivery);

      let patchPNCdata = Object.assign({}, tempPNCData);
      this.patientPNCForm.patchValue(tempPNCData);
    })
  }

  updatePatientPNC(patientPNCForm) {
    let temp = {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      benVisitID: localStorage.getItem('visitID'),
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      modifiedBy: localStorage.getItem('userName'),
      visitCode: localStorage.getItem('visitCode')
    }

    this.doctorService.updatePNCDetails(patientPNCForm, temp)
      .subscribe((res: any) => {
        if (res.statusCode == 200 && res.data != null) {
          this.confirmationService.alert(res.data.response, 'success');
          this.patientPNCForm.markAsPristine();
        } else {
          this.confirmationService.alert(res.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      })
  }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
  }

  beneficiaryDetailsSubscription: any
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          console.log('beneficiaryDetails', beneficiaryDetails.ageVal);
          this.beneficiaryAge = beneficiaryDetails.ageVal
          if (!this.mode)
            this.checkDate();
        }
      })
  }

  checkDate() {
    this.today = new Date();
    this.dob = new Date();
    this.dob.setFullYear(this.today.getFullYear() - this.beneficiaryAge);
    console.log('this.dob', this.dob, 'this.today', this.today);
  }

  checkWeight() {
    if (this.birthWeightOfNewborn >= 6.0)
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
  }

  get birthWeightOfNewborn() {
    return this.patientPNCForm.controls['birthWeightOfNewborn'].value;
  }

  get deliveryPlace() {
    return this.patientPNCForm.controls['deliveryPlace'].value;
  }

  resetOtherPlaceOfDelivery() {
    this.selectDeliveryTypes = [];
    if (this.deliveryPlace.deliveryPlace == 'Home-Supervised' || this.deliveryPlace.deliveryPlace == 'Home-Unsupervised') {
      let tempDeliveryTypes = this.masterData.deliveryTypes.filter(item => {
        console.log('item', item);

        return item.deliveryType != "Assisted Delivery" && item.deliveryType != "Cesarean Section (LSCS)";
      })
      this.selectDeliveryTypes = tempDeliveryTypes;
    } else {
      this.selectDeliveryTypes = this.masterData.deliveryTypes;
    }
    this.patientPNCForm.patchValue({ otherDeliveryPlace: null, deliveryType: null });
    // this.patientPNCForm.controls['deliveryType'].markAsUntouched();
    // this.patientPNCForm.controls['deliveryType'].markAsPristine();
  }


  masterData: any;
  selectDeliveryTypes: any
  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData && masterData.deliveryTypes) {
        console.log('masterData?.deliveryComplicationTypes', masterData.deliveryComplicationTypes);

        this.masterData = masterData;
        this.selectDeliveryTypes = this.masterData.deliveryTypes;

        if (this.mode) {
          let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.patchDataToFields(benRegID, visitID);
        }
        if(parseInt(localStorage.getItem("specialistFlag")) == 100)
        {
          let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.patchDataToFields(benRegID, visitID);
        }
      }
    })
  }

  resetOtherDeliveryComplication() {
    this.patientPNCForm.patchValue({ otherDeliveryComplication: null })
  }

  get deliveryComplication() {
    return this.patientPNCForm.controls['deliveryComplication'].value;
  }

  get otherDeliveryComplication() {
    return this.patientPNCForm.controls['otherDeliveryComplication'].value;
  }

  resetOtherPostNatalComplication() {
    this.patientPNCForm.patchValue({ otherPostNatalComplication: null })
  }

  get postNatalComplication() {
    return this.patientPNCForm.controls['postNatalComplication'].value;
  }

  get otherPostNatalComplication() {
    return this.patientPNCForm.controls['otherPostNatalComplication'].value;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

}
