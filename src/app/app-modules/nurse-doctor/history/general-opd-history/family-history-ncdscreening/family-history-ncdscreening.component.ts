import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog } from '@angular/material';
import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { IdrsscoreService } from 'app/app-modules/nurse-doctor/shared/services/idrsscore.service';
import { BeneficiaryDetailsService } from 'app/app-modules/core/services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';

@Component({
  selector: 'app-family-history-ncdscreening',
  templateUrl: './family-history-ncdscreening.component.html',
  styleUrls: ['./family-history-ncdscreening.component.css']
})
export class FamilyHistoryNcdscreeningComponent implements OnInit, DoCheck {

  @Input('familyHistory')
  familyHistoryForm: FormGroup;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitType: any;

  masterData: any;
  familyHistoryData: any;

  diseaseMasterData = [];
  familyMemeberMasterData = [];
  previousSelectedDiseaseList = [];
  diseaseSelectList = [];
  familyMembersArray: any = [];
  IDRSScoreForFamilyMembes: any = 0;
  idrsscoredummy: any;
  diabetesMellitusSelected: boolean = false;
  beneficiaryDetailSubscription: any;
  age: any;
  currentLanguageSet: any;


  constructor(
    private fb: FormBuilder,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService,
    private idrsscore: IdrsscoreService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private httpServices:HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.idrsscore.clearMessage();
    this.idrsscore.IDRSFamilyScore$.subscribe(response => this.idrsscoredummy = response);
    this.getMasterData();
    this.getBeneficiaryDetails();
    // localStorage.removeItem("diabetesMellitusSelected")
  }

  ngOnChanges()
  {
    
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.generalHistorySubscription)
      this.generalHistorySubscription.unsubscribe();
  }


  nurseMasterDataSubscription: any;
  getMasterData() {

    // this.masterData = this.dummy;
    // this.diseaseMasterData = this.masterData.data.DiseaseTypes;
    // this.familyMemeberMasterData = this.masterData.data.familyMemberTypes;
    // this.addFamilyDisease();
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.masterData = masterData;
        this.diseaseMasterData = masterData.DiseaseTypes;
        this.familyMemeberMasterData = masterData.familyMemberTypes;

       
        this.addFamilyDisease();
     

        if (this.mode == 'view') {
          let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getGeneralHistory(benRegID, visitID);
        }
        if(parseInt(localStorage.getItem("specialistFlag")) == 100)
        {
          
           let visitID = localStorage.getItem('visitID');
          let benRegID = localStorage.getItem('beneficiaryRegID')
          this.getGeneralHistory(benRegID, visitID);
        }
      
      }
    })
  }

  generalHistorySubscription: any;
  getGeneralHistory(benRegID, visitID) {
    this.generalHistorySubscription = this.doctorService.getGeneralHistoryDetails(benRegID, visitID).subscribe(history => {
      if (history != null && history.statusCode == 200 && history.data != null && history.data.FamilyHistory) {
        this.familyHistoryData = history.data.FamilyHistory;
        this.handleFamilyHistoryData();
      }
    })
  }

  handleFamilyHistoryData() {
    this.familyHistoryForm.patchValue(this.familyHistoryData);
    let formArray = this.familyHistoryForm.controls['familyDiseaseList'] as FormArray;
    let temp = this.familyHistoryData.familyDiseaseList.slice();

    for (let i = 0; i < temp.length; i++) {
      let diseaseType = this.diseaseMasterData.filter(item => {
        return item.diseaseType == temp[i].diseaseType;
      });

      if (diseaseType.length > 0)
        temp[i].diseaseType = diseaseType[0];

      if (temp[i].diseaseType) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterFamilyDiseaseList(temp[i].diseaseType, i);
      }

      if (i + 1 < temp.length)
        this.addFamilyDisease();


    }
    let familyMemberList;
    temp.forEach(element => {
      if (element.diseaseType!=undefined && element.diseaseType.diseaseType!=undefined && element.diseaseType.diseaseType == "Diabetes Mellitus") {
        familyMemberList = element.familyMembers;
        // this.diabetesMellitusSelected = true;
        // localStorage.setItem("diabetesMellitusSelected", element.diseaseType.diseaseType);
        this.patchFamilyMembersIDRSScore(familyMemberList);
      }

    });
  }

  addFamilyDisease() {
    let familyDiseaseList = <FormArray>this.familyHistoryForm.controls['familyDiseaseList'];
    let temp = familyDiseaseList.value;

    if (this.diseaseMasterData) {
      let result = this.diseaseMasterData.filter((item) => {
        let arr = temp.filter((value) => {
          if (value.diseaseType != null && value.diseaseType.diseaseType != "Other") {
            // if (value.diseaseType != null && value.diseaseType.diseaseType == "Diabetes Mellitus") {
            //   this.diabetesMellitusSelected = true;
            //   localStorage.setItem("diabetesMellitusSelected", value.diseaseType.diseaseType);
            // }
            return value.diseaseType.diseaseType == item.diseaseType;
          }


          else
            return false
        });
        if (item.diseaseType == "None" && temp.length > 0)
          return false;
        else if (arr.length == 0)
          return true;
        else
          return false;
        // let flag = arr.length == 0 ? true : false;
        // return flag;
      });
      // temp.forEach(element => {
      //   if(element.deleted == true){
      //     this.diseaseSelectList[index] = [];
      //     result.push(element.diseaseType);
      //   }
      // });
      this.diseaseSelectList.push(result.slice());
      // this.sortDiseaseList(this.diseaseSelectList[0]);
    }
    familyDiseaseList.push(this.initFamilyDiseaseList());
  }
  addFamilyDiseaseTest(index) {
    let familyDiseaseList = <FormArray>this.familyHistoryForm.controls['familyDiseaseList'];
    let temp = familyDiseaseList.value;

    if (this.diseaseMasterData) {
      let result = this.diseaseMasterData.filter((item) => {
        let arr = temp.filter((value) => {
          if (value.diseaseType != null && value.diseaseType.diseaseType != "Other") {
            // if (value.diseaseType != null && value.diseaseType.diseaseType == "Diabetes Mellitus") {
            //   // this.diabetesMellitusSelected = true;
            //   // localStorage.setItem("diabetesMellitusSelected", value.diseaseType.diseaseType);
            // }
            return value.diseaseType.diseaseType == item.diseaseType;
          }


          else
            return false
        });
        console.log("test", arr);

        if (item.diseaseType == "None" && temp.length > 0)
          return false;
        else if (arr.length == 0)
          return true;
        else
          return false;
        // let flag = arr.length == 0 ? true : false;
        // return flag;
      });

      temp.forEach(element => {
        if (element.deleted == true) {
          let lastIndex = result.length
          let truediseaseType = element.diseaseType.diseaseType
          let check = 0
          temp.forEach(fValue => {
            if (fValue.deleted == false) {
              if (element.diseaseType.diseaseType == fValue.diseaseType.diseaseType) {
                check++;
              }
            }

          });
          if (check == 0) {
            result.push(element.diseaseType);
          }



        }
      });



      let totalLength = this.diseaseSelectList.length + 1; //= 3
      this.diseaseSelectList.splice(totalLength, 0, result.slice());
      // this.diseaseSelectList[index + 1].push(result.slice());
      this.sortDiseaseList(this.diseaseSelectList[index + 1]);
    }
    familyDiseaseList.push(this.initFamilyDiseaseList());
  }

  filterFamilyDiseaseList(disease, i, familyDiseaseForm?: FormGroup) {
    let familyDiseaseList = <FormArray>this.familyHistoryForm.controls['familyDiseaseList'];
    let tempArray = familyDiseaseList.value;
    let previousValue = this.previousSelectedDiseaseList[i];
    if (disease.diseaseType == 'None') {
      this.removeFamilyDiseaseExecptNone();
    }

    console.log("diseaseForm", familyDiseaseForm);

    let diabetesPresent = false;
    tempArray.forEach(element => {
      if (element.diseaseType.diseaseType === "Diabetes Mellitus") {
        diabetesPresent = true;
         
      }
    });
    if(!diabetesPresent){
      this.idrsscore.setIDRSFamilyScore(0);
    }
    
    // if (flag) {
    //   this.diabetesMellitusSelected = true;
    //   localStorage.setItem("diabetesMellitusSelected", "Diabetes Mellitus");
    // } else {
    //   this.diabetesMellitusSelected = false;
    //   localStorage.removeItem("diabetesMellitusSelected")
    // }

    if (familyDiseaseForm) {
      if (disease.diseaseType != 'Other') {

        if (disease.snomedCode != null) {
          familyDiseaseForm.patchValue({ otherDiseaseType: null, snomedCode: disease.snomedCode, snomedTerm: disease.snomedTerm });
        } else {
          familyDiseaseForm.patchValue({ snomedCode: null, snomedTerm: null });
        }
      }
      else {
        familyDiseaseForm.patchValue({ snomedCode: null, snomedTerm: null });
      }

      familyDiseaseForm.patchValue({ familyMembers: null })
    }


    if (previousValue) {
      this.diseaseSelectList.map((item, t) => {
        if (t != i && previousValue.diseaseType != 'Other') {
          item.push(previousValue);
          this.sortDiseaseList(item);
        }
      })
    }

    this.diseaseSelectList.map((item, t) => {
      let index = item.indexOf(disease);
      if (index != -1 && t != i && disease.diseaseType != 'Other')
        item = item.splice(index, 1);
    })

    this.previousSelectedDiseaseList[i] = disease;
  }

  removeFamilyDiseaseExecptNone() {
    let familyDiseaseList = <FormArray>this.familyHistoryForm.controls['familyDiseaseList'];
    while (familyDiseaseList.length > 1) {
      let i = familyDiseaseList.length - 1;

      let removedValue = this.previousSelectedDiseaseList[i];
      if (removedValue)
        this.diseaseSelectList[0].push(removedValue);

      this.sortDiseaseList(this.diseaseSelectList[0]);
      familyDiseaseList.removeAt(i);
      this.previousSelectedDiseaseList.splice(i, 1);
      this.diseaseSelectList.splice(i, 1);
    }
  }

  removeFamilyDisease(i, familyHistoryForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {
        let familyDiseaseList = <FormArray>this.familyHistoryForm.controls['familyDiseaseList'];
        let temp = familyDiseaseList.value;
        this.familyHistoryForm.markAsDirty();
        if (!!familyHistoryForm && familyDiseaseList.length == 1) {
          if (familyDiseaseList.value[i].ID != null) {
            familyDiseaseList.value[i].deleted = true;
            let removedValue = this.previousSelectedDiseaseList[i];
            if (removedValue != null && removedValue.diseaseType === "Diabetes Mellitus") {
              // this.diabetesMellitusSelected = false;
              // localStorage.removeItem("diabetesMellitusSelected");
              this.idrsscore.setIDRSFamilyScore(0);
            }
            familyDiseaseList.push(this.initFamilyDiseaseList());
            this.diseaseSelectList.push(this.diseaseMasterData);
            // this.diabetesMellitusSelected = false;
            // localStorage.removeItem("diabetesMellitusSelected");
          } else {
            familyHistoryForm.reset();
            familyHistoryForm.patchValue({deleted : false});
            let removedValue = this.previousSelectedDiseaseList[i];
            if (removedValue != null && removedValue.diseaseType === "Diabetes Mellitus") {
              // this.diabetesMellitusSelected = false;
              // localStorage.removeItem("diabetesMellitusSelected");
              this.idrsscore.setIDRSFamilyScore(0);
            }
          }
        } else {
          let removedValue = this.previousSelectedDiseaseList[i];
          this.diseaseSelectList.map((item, t) => {
            if (t != i && removedValue && removedValue.diseaseType != 'Other') {
              item.push(removedValue);
              this.sortDiseaseList(item);
            }
          })
          if (removedValue != null && removedValue.diseaseType === "Diabetes Mellitus") {
            // this.diabetesMellitusSelected = false;
            // localStorage.removeItem("diabetesMellitusSelected");
            this.idrsscore.setIDRSFamilyScore(0);
          }
          if (familyDiseaseList.value[i].ID != null) {
            familyDiseaseList.value[i].deleted = true;
            this.diseaseSelectList[i] = [];
          } else {
            this.previousSelectedDiseaseList.splice(i, 1);
            this.diseaseSelectList.splice(i, 1);
            familyDiseaseList.removeAt(i);
          }
          let familyDiseaseList1 = <FormArray>this.familyHistoryForm.controls['familyDiseaseList'];
          let temp1 = familyDiseaseList1.value;
          let lastIndex = 0
          temp1.forEach(element => {
            if (element.deleted == false) {
              lastIndex++
            }
          });
          if (lastIndex == 0) {

            familyDiseaseList.push(this.initFamilyDiseaseList());

            this.diseaseSelectList.push(this.diseaseMasterData);
          }
        }
      }
    });
  }

  getPreviousFamilyHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousFamilyHistory(benRegID, this.visitType)
      .subscribe(res => {
        if (res.statusCode == 200 && res.data != null) {
          if (res.data.data.length > 0) {
            this.viewPreviousData(res.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.info.pastHistoryNot);
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
        }
      }, err => {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.familyhistory.previousfamilyhistory }
    });
  }

  initFamilyDiseaseList() {
    return this.fb.group({
      ID: null,
      deleted: false,
      diseaseTypeID: null,
      diseaseType: null,
      otherDiseaseType: null,
      familyMembers: null,
      snomedCode: null,
      snomedTerm: null
    });
  }

  get isGeneticDisorder() {
    return this.familyHistoryForm.controls['isGeneticDisorder'].value;
  }

  resetOtherGeneticOrder() {
    this.familyHistoryForm.patchValue({ geneticDisorder: null });
  }

  sortDiseaseList(diseaseList) {
    diseaseList.sort((a, b) => {
      if (a.diseaseType == b.diseaseType) return 0;
      if (a.diseaseType < b.diseaseType) return -1;
      else return 1;
    })
  }

  checkValidity(diseaseForm) {
    let temp = diseaseForm.value;
    if (temp.diseaseType && temp.familyMembers) {
      return false;
    } else {
      return true;
    }

  }

  filterFamilyMembers(familyMembers, familyGroup) {
    this.familyMembersArray = familyMembers.value;
    // this.IDRSScoreForFamilyMembes = 0;
    let familyDiseaseType = familyGroup.value.diseaseType.diseaseType
    console.log("there",familyGroup);
    
    let singleParent = false;
    let bothParent = false;
    let IDRSScoreForFamilyMembes = 0;
    // let isdiabetes = localStorage.getItem("diabetesMellitusSelected")
    if (familyDiseaseType && familyDiseaseType === "Diabetes Mellitus") {
      if (this.familyMembersArray.length > 0) {
        this.familyMembersArray.forEach(element => {
          console.log(element);
          if (element == "Father") {
            if (singleParent) {
              bothParent = true;
            }
            singleParent = true
          }
          if (element == "Mother") {
            if (singleParent) {
              bothParent = true
            }
            singleParent = true;
          }

        });
      }

      console.log("singleParent", singleParent);
      console.log('bothParent', bothParent);


      if (singleParent) {
        IDRSScoreForFamilyMembes = 10;
      }

      if (bothParent) {
        IDRSScoreForFamilyMembes = 20;
      }


      console.log("score", IDRSScoreForFamilyMembes);
      localStorage.setItem("IdRSScoreFamilyHistory", IDRSScoreForFamilyMembes.toString());

      this.idrsscore.setIDRSFamilyScore(IDRSScoreForFamilyMembes);

      this.idrsscore.setIDRSScoreFlag();
    }


    console.log("family", familyMembers);

  }

  patchFamilyMembersIDRSScore(familyMembers) {
    this.familyMembersArray = familyMembers;
    // this.IDRSScoreForFamilyMembes = 0;
    let singleParent = false;
    let bothParent = false;
    let IDRSScoreForFamilyMembes = 0;

    if (this.familyMembersArray.length > 0) {
      this.familyMembersArray.forEach(element => {
        console.log(element);
        if (element == "Father") {
          if (singleParent) {
            bothParent = true;
          }
          singleParent = true
        }
        if (element == "Mother") {
          if (singleParent) {
            bothParent = true
          }
          singleParent = true;
        }

      });
    }
    if (singleParent) {
      IDRSScoreForFamilyMembes = 10;
    }

    if (bothParent) {
      IDRSScoreForFamilyMembes = 20;
    }


    // console.log("score", IDRSScoreForFamilyMembes);
    // localStorage.setItem("IdRSScoreFamilyHistory", IDRSScoreForFamilyMembes.toString());

    this.idrsscore.setIDRSFamilyScore(IDRSScoreForFamilyMembes);
    console.log("family", familyMembers);

  }
  getBeneficiaryDetails(){
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiary => {
        console.log("idrs", beneficiary);
        if (beneficiary) {
          if (beneficiary.ageVal) {
            this.age = beneficiary.ageVal;
           
          } else {
            this.age = 0;
          }
        }
      })
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
}


