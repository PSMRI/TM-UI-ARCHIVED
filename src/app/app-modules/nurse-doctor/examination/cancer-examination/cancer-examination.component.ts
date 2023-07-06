import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { DoctorService } from '../../shared/services/doctor.service';
import { BeneficiaryDetailsService, ConfirmationService } from '../../../core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'cancer-examination',
  templateUrl: './cancer-examination.component.html',
  styleUrls: ['./cancer-examination.component.css']
})
export class CancerExaminationComponent implements OnInit {
  @Input('examinationForm')
  cancerForm: FormGroup;

  @Input('mode')
  mode: String;

  female = false;
  showBreastExamination = false;
  current_language_set: any;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.getBeneficiaryDetails();

    if (this.cancerForm.get('signsForm')) {
      this.cancerForm.get('signsForm').valueChanges.subscribe(value => {
        if (value.breastEnlargement)
          this.showBreastExamination = true;
        else
          this.showBreastExamination = false;
      })
    }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges() {
    if (this.mode == "update")
      this.upadteCancerExaminationDetails();

    if (this.mode == "view")
      this.fetchCancerExaminationDetails();
      
      if(parseInt(localStorage.getItem("specialistFlag")) == 100)
      {
        this.fetchCancerExaminationDetails();
      }
  }

  getImageCoordinates(examinationForm) {
    let imageCords = [];
    let image1 = examinationForm.controls.oralExaminationForm.controls['image'].value;
    if (image1 && examinationForm.controls.oralExaminationForm.dirty)
      imageCords.push(image1);
    let image2 = examinationForm.controls.abdominalExaminationForm.controls['image'].value;
    if (image2 && examinationForm.controls.abdominalExaminationForm.dirty)
      imageCords.push(image2);
    let image3 = examinationForm.controls.gynecologicalExaminationForm.controls['image'].value;
    if (image3 && examinationForm.controls.gynecologicalExaminationForm.dirty)
      imageCords.push(image3);
    let image4 = examinationForm.controls.breastExaminationForm.controls['image'].value;
    if (image4 && examinationForm.controls.breastExaminationForm.dirty)
      imageCords.push(image4);

    return imageCords;
  }

  updateExaminationSubs: any;
  upadteCancerExaminationDetails() {
    let vanID = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
    let parkingPlaceID = JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID
    let updateDetails = {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      benVisitID: localStorage.getItem('visitID'),
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      modifiedBy:localStorage.getItem('userName'),
      beneficiaryID: localStorage.getItem('beneficiaryID'), sessionID: localStorage.getItem('sessionID'),
      parkingPlaceID: parkingPlaceID, vanID: vanID,
      benFlowID: localStorage.getItem('benFlowID'),
      visitCode: localStorage.getItem('visitCode')
    }

    let imageCoordinates = this.getImageCoordinates(this.cancerForm);

    this.updateExaminationSubs = this.doctorService.updateCancerExaminationDetails(this.cancerForm, updateDetails, imageCoordinates)
      .subscribe((res: any) => {
        if (res.statusCode == 200 && res.data != null) {
          setTimeout(() => this.confirmationService.alert(res.data.response, 'success'), 0);
          this.cancerForm.markAsPristine();
        } else {
          setTimeout(() => this.confirmationService.alert(res.errorMessage, 'error'), 0);
        }
      }, err => {
        setTimeout(() => this.confirmationService.alert(err, 'error'), 0);
      })
  }


  fetchExaminationDetailsSubs: any;
  fetchCancerExaminationDetails() {
    let beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
    let benVisitID = localStorage.getItem('visitID');

    this.fetchExaminationDetailsSubs = this.doctorService.getCancerExaminationDetails(beneficiaryRegID, benVisitID)
      .subscribe((res: any) => {
        if (res.statusCode == 200 && res.data != null) {
          this.patchExaminationDetails(res.data);
        } else {
          setTimeout(() => this.confirmationService.alert(res.errorMessage, 'error'), 0);
        }
      }, err => {
        setTimeout(() => this.confirmationService.alert(err, 'error'), 0);
      })
  }

  filterAnnotatedImageList(imageCoordinates, imageID) {
    let image;
    let temp = imageCoordinates.filter(item => item.imageID == imageID);
    if (temp.length == 1)
      image = temp[0];
    return image;
  }

  patchExaminationDetails(examinationDetails) {
    if (examinationDetails.signsAndSymptoms) {
      let signFormDetails = Object.assign({}, examinationDetails.signsAndSymptoms, { lymphNodes: examinationDetails.BenCancerLymphNodeDetails });
      let lymphNodesFormArray = (<FormArray>(<FormGroup>this.cancerForm.controls['signsForm']).controls.lymphNodes).controls;

      let lymphNodes = signFormDetails.lymphNodes.slice();
      delete signFormDetails.lymphNodes;
      this.cancerForm.controls['signsForm'].patchValue(signFormDetails);

      lymphNodes.forEach(element => {
        let temp = lymphNodesFormArray.filter((lymphForm: FormGroup) => {
          return lymphForm.controls['lymphNodeName'].value == element.lymphNodeName;
        })

        if (temp.length > 0)
          temp[0].patchValue(element);
      });

    }

    if (examinationDetails.oralExamination) {
      let image = this.filterAnnotatedImageList(examinationDetails.imageCoordinates, 3);
      let arr = ["Leukoplakia", "Sub muscus fibrosis", "Melanoplakia", "Erythroplakia", "Non healing mouth ulcer(>2 weeks)", "Any other lesion"];

      let temp = examinationDetails.oralExamination.preMalignantLesionType.split(',');
      temp.pop();


      let other = temp.filter((item) => {
        return arr.indexOf(item) == -1;
      });

      console.log("there", other, temp);


      if (other.length > 0) {
        examinationDetails.oralExamination.otherLesionType = other[0];
        temp.push("Any other lesion");
      }
      examinationDetails.oralExamination.preMalignantLesionTypeList = temp;

      let oralExaminationFormDetails = Object.assign({}, examinationDetails.oralExamination, { image });

      this.cancerForm.controls['oralExaminationForm'].patchValue(oralExaminationFormDetails);
    }
    if (examinationDetails.breastExamination) {
      let image = this.filterAnnotatedImageList(examinationDetails.imageCoordinates, 2);
      let breastExaminationFormDetails = Object.assign({}, examinationDetails.breastExamination, { image });
      this.cancerForm.controls['breastExaminationForm'].patchValue(breastExaminationFormDetails);
    }

    if (examinationDetails.abdominalExamination) {
      let image = this.filterAnnotatedImageList(examinationDetails.imageCoordinates, 1);
      let abdominalExaminationFormDetails = Object.assign({}, examinationDetails.abdominalExamination, { image });
      this.cancerForm.controls['abdominalExaminationForm'].patchValue(abdominalExaminationFormDetails);
    }

    if (examinationDetails.gynecologicalExamination) {
      let image = this.filterAnnotatedImageList(examinationDetails.imageCoordinates, 4);
      let gynecologicalExaminationFormDetails = Object.assign({}, examinationDetails.gynecologicalExamination, { image });
      let splitTypeOfLesion = examinationDetails.gynecologicalExamination.typeOfLesion.split(',');
      splitTypeOfLesion.pop();
      gynecologicalExaminationFormDetails.typeOfLesionList = splitTypeOfLesion;
      this.cancerForm.controls['gynecologicalExaminationForm'].patchValue(gynecologicalExaminationFormDetails);
    }

  }

  beneficiaryDetailsSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if ((beneficiaryDetails && beneficiaryDetails.genderName && beneficiaryDetails.genderName.toLowerCase() == 'female') || (beneficiaryDetails && beneficiaryDetails.genderName && beneficiaryDetails.genderName.toLocaleLowerCase() == 'transgender'))
          this.female = true;
      })
  }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();

    if (this.fetchExaminationDetailsSubs)
      this.fetchExaminationDetailsSubs.unsubscribe();

    if (this.updateExaminationSubs)
      this.updateExaminationSubs.unsubscribe();
  }

}

