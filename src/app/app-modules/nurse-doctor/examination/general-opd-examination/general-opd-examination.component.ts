import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { DoctorService } from '../../shared/services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'nurse-general-opd-examination',
  templateUrl: './general-opd-examination.component.html',
  styleUrls: ['./general-opd-examination.component.css']
})
export class GeneralOpdExaminationComponent implements OnInit {

  @Input('visitCategory')
  visitCategory: string;

  @Input('patientExaminationForm')
  patientExaminationForm: FormGroup;

  @Input('mode')
  mode: String;
  current_language_set: any;

  constructor(
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
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
    if (this.ancExaminationDataSubscription)
      this.ancExaminationDataSubscription.unsubscribe();
  }

  ngOnChanges() {
    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getAncExaminationData(benRegID, visitID);
    }
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getAncExaminationData(benRegID, visitID);
    }
    if (this.mode == 'update') {
      this.updatePatientExamination(this.patientExaminationForm);
    }
  }

  checkRequired(patientExaminationForm) {
    const required = [];
    const generalExaminationForm = <FormGroup>patientExaminationForm.controls['generalExaminationForm'];
    if (generalExaminationForm.controls['typeOfDangerSigns'].errors) {
      required.push(this.current_language_set.ExaminationData.ANC_OPD_PNCExamination.genExamination.dangersigns);
    }
    if (generalExaminationForm.controls['lymphnodesInvolved'].errors) {
      required.push(this.current_language_set.ExaminationData.ANC_OPD_PNCExamination.genExamination.lymph);
    }
    if (generalExaminationForm.controls['typeOfLymphadenopathy'].errors) {
      required.push(this.current_language_set.ExaminationData.ANC_OPD_PNCExamination.genExamination.typeofLymphadenopathy);
    }
    if (generalExaminationForm.controls['extentOfEdema'].errors) {
      required.push(this.current_language_set.ExaminationData.ANC_OPD_PNCExamination.genExamination.extentofEdema);
    }
    if (generalExaminationForm.controls['edemaType'].errors) {
      required.push(this.current_language_set.ExaminationData.ANC_OPD_PNCExamination.genExamination.typeofEdema);

    }
    if (required.length) {
      this.confirmationService.notify(this.current_language_set.alerts.info.mandatoryFields, required);
      return false;
    } else {
      return true;
    }
  }
  updatePatientExamination(patientExaminationForm) {
    if (this.checkRequired(patientExaminationForm)) {
      let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
      let parkingPlaceID = JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID
      let updateDetails = {
        beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
        benVisitID: localStorage.getItem('visitID'),
        providerServiceMapID: localStorage.getItem('providerServiceID'),
        modifiedBy: localStorage.getItem('userName'),
        beneficiaryID: localStorage.getItem('beneficiaryID'), sessionID: localStorage.getItem('sessionID'),
        parkingPlaceID: parkingPlaceID, vanID: vanID,
        benFlowID: localStorage.getItem('benFlowID'),
        visitCode: localStorage.getItem('visitCode')
      }

      this.doctorService.updatePatientExamination(patientExaminationForm.value, this.visitCategory, updateDetails)
        .subscribe((res: any) => {
          if (res.statusCode == 200 && res.data != null) {
            this.confirmationService.alert(this.current_language_set.alerts.info.examUpdated, 'success');
            this.patientExaminationForm.markAsPristine();
          } else {
            this.confirmationService.alert(this.current_language_set.alerts.info.errorInExamUpdated, 'error');
          }
        }, err => {
          this.confirmationService.alert(this.current_language_set.alerts.info.errorInExamUpdated, 'error');
        })
    }
  }

  ancExaminationDataSubscription: any;
  getAncExaminationData(benRegID, visitID) {
    this.ancExaminationDataSubscription = this.doctorService.getGeneralExamintionData(benRegID, visitID)
      .subscribe(examinationData => {
        if (examinationData.statusCode == 200 && examinationData.data) {
          console.log('examinationData.data', JSON.stringify(examinationData.data, null, 4))
          let temp = examinationData.data;

          if (this.visitCategory == 'ANC') {
            let ancFormData = Object.assign({
              'generalExaminationForm': temp.generalExamination,
              'headToToeExaminationForm': temp.headToToeExamination,
              'systemicExaminationForm': Object.assign({
                'cardioVascularSystemForm': temp.cardiovascularExamination,
                'respiratorySystemForm': temp.respiratoryExamination,
                'centralNervousSystemForm': temp.centralNervousExamination,
                'musculoSkeletalSystemForm': temp.musculoskeletalExamination,
                'genitoUrinarySystemForm': temp.genitourinaryExamination,
                'obstetricExaminationForANCForm': temp.obstetricExamination
              })
            });
            this.patientExaminationForm.patchValue(ancFormData);
          }

          if (this.visitCategory == 'PNC') {
            let ancFormData = Object.assign({
              'generalExaminationForm': temp.generalExamination,
              'headToToeExaminationForm': temp.headToToeExamination,
              'systemicExaminationForm': Object.assign({
                'gastroIntestinalSystemForm': temp.gastrointestinalExamination,
                'cardioVascularSystemForm': temp.cardiovascularExamination,
                'respiratorySystemForm': temp.respiratoryExamination,
                'centralNervousSystemForm': temp.centralNervousExamination,
                'musculoSkeletalSystemForm': temp.musculoskeletalExamination,
                'genitoUrinarySystemForm': temp.genitourinaryExamination,
              })
            });
            this.patientExaminationForm.patchValue(ancFormData);
          }

          if (this.visitCategory == 'General OPD') {
            let ancFormData = Object.assign({
              'generalExaminationForm': temp.generalExamination,
              'headToToeExaminationForm': temp.headToToeExamination,
              'systemicExaminationForm': Object.assign({
                'gastroIntestinalSystemForm': temp.gastrointestinalExamination,
                'cardioVascularSystemForm': temp.cardiovascularExamination,
                'respiratorySystemForm': temp.respiratoryExamination,
                'centralNervousSystemForm': temp.centralNervousExamination,
                'musculoSkeletalSystemForm': temp.musculoskeletalExamination,
                'genitoUrinarySystemForm': temp.genitourinaryExamination,
                'obstetricExaminationForANCForm': temp.obstetricExamination
              })
            });
            this.patientExaminationForm.patchValue(ancFormData);
          }
        }
      })
  }

}
