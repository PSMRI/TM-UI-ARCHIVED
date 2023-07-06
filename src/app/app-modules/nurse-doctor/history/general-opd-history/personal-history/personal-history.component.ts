import { Component, OnInit, Input, DoCheck } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, FormControl } from "@angular/forms";

import { PreviousDetailsComponent } from "../../../../core/components/previous-details/previous-details.component";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import {
  MasterdataService,
  NurseService,
  DoctorService
} from "../../../shared/services";

import { ConfirmationService } from "../../../../core/services/confirmation.service";
import { ValidationUtils } from "../../../shared/utility/validation-utility";
import { BeneficiaryDetailsService } from "../../../../core/services/beneficiary-details.service";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { DiagnosisSearchComponent } from "app/app-modules/core/components/diagnosis-search/diagnosis-search.component";
import { AllergenSearchComponent } from "app/app-modules/core/components/allergen-search/allergen-search.component";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";


@Component({
  selector: "general-personal-history",
  templateUrl: "./personal-history.component.html",
  styleUrls: ["./personal-history.component.css"]
})
export class GeneralPersonalHistoryComponent implements OnInit, DoCheck {
  @Input("personalHistory")
  generalPersonalHistoryForm: FormGroup;

  @Input("mode")
  mode: string;

  @Input("visitCategory")
  visitType: any;

  masterData: any;
  personalHistoryData: any;

  tobaccoMasterData: any;
  previousSelectedTobaccoList = [];
  tobaccoSelectList = [];

  alcoholMasterData: any;
  previousSelectedAlcoholList = [];
  alcoholSelectList = [];
  componentFlag: boolean=false;
  enableAlert: boolean=true;

  allergyMasterData = [
    {
      alleryID: 1,
      allergyType: "Drugs"
    },
    {
      alleryID: 2,
      allergyType: "Food"
    },
    {
      alleryID: 3,
      allergyType: "Environmental"
    }
  ];
  previousSelectedAlleryList = [];
  allerySelectList = [];
  currentLanguageSet: any;
  snomedTerm: any;
  snomedCode: any;
  selectedSnomedTerm: any;
  countForSearch: number = 0;
  
 

  constructor(
    private fb: FormBuilder,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    if(this.mode != "view" && this.mode != "update") {
    this.getMasterData();
    }
    this.getBeneficiaryDetails();

    this.generalHistorySubscription = this.doctorService.
    populateHistoryResponse$
      .subscribe(history => {
        if (
          history != null &&
          history.statusCode == 200 &&
          history.data != null &&
          history.data.PersonalHistory) {
            this.personalHistoryData = history.data.PersonalHistory;
        this.getMasterData();
          }
      });

      if(this.mode != "view" && this.mode != "update"){
          this.generalPersonalHistoryForm.reset();
        } else {
         this.generalPersonalHistoryForm.reset();
        }
  }

  ngOnChanges()
  {
 
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
      this.generalPersonalHistoryForm.reset();
  }

  beneficiaryDetailSubscription: any;
  beneficiary: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
      beneficiary => {
        this.beneficiary = beneficiary;
      }
    );
  }

  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(
      masterData => {
        if (masterData && (this.masterData == null || this.masterData == undefined)) {
          this.masterData = masterData;
          this.tobaccoMasterData = masterData.typeOfTobaccoProducts;
          this.alcoholMasterData = masterData.typeOfAlcoholProducts;
          // this.addTobacco();
          // this.addAlcohol();
          // this.addAllergy();
          this.addMasters();

          if (this.mode == "view") {
            let visitID = localStorage.getItem("visitID");
            let benRegID = localStorage.getItem("beneficiaryRegID");
            this.getGeneralHistory(benRegID, visitID);
          }

          if(parseInt(localStorage.getItem("specialistFlag")) == 100)
          {
        let visitID = localStorage.getItem("visitID");
        let benRegID = localStorage.getItem("beneficiaryRegID");
        this.getGeneralHistory(benRegID, visitID);
          }
         
        }
      }
    );
  }

  generalHistorySubscription: any;
  getGeneralHistory(benRegID, visitID) {
    this.generalHistorySubscription = this.doctorService
      .getGeneralHistoryDetails(benRegID, visitID)
      .subscribe(history => {
        if (
          history != null &&
          history.statusCode == 200 &&
          history.data != null &&
          history.data.PersonalHistory
        ) {
          this.personalHistoryData = history.data.PersonalHistory;
          this.generalPersonalHistoryForm.patchValue(this.personalHistoryData);
          this.handlePersonalTobaccoHistoryData();
          this.handlePersonalAlcoholHistoryData();
          this.handlePersonalAllergyHistoryData();
        }
      });
  }

  addMasters() {

    if (this.personalHistoryData != null && this.personalHistoryData != undefined ) {
          this.generalPersonalHistoryForm.patchValue(this.personalHistoryData);
        }


        //Adding Allergy
    let allergicList = <FormArray>(
      this.generalPersonalHistoryForm.controls["allergicList"]
    );
    if (allergicList.length < this.allergyMasterData.length) {
      let tempAllergy = allergicList.value;
      if (this.allergyMasterData) {
        let resultAllergy = this.allergyMasterData.filter(itemAllergy => {
          let arrAllergy = tempAllergy.filter(valueAllergy => {
            if (valueAllergy.allergyType != null)
              return valueAllergy.allergyType.allergyType == itemAllergy.allergyType;
          });
          let flagAllergy = arrAllergy.length == 0 ? true : false;
          return flagAllergy;
        });
        
        this.allerySelectList.push(resultAllergy.slice());
      }
      
      allergicList.push(this.initAllergyList());

      if (this.personalHistoryData != null && this.personalHistoryData != undefined ) {
        this.handlePersonalAllergyHistoryData();
      }

      
    }

    //Adding Tobacco
    let tobaccoList = <FormArray>(
      this.generalPersonalHistoryForm.controls["tobaccoList"]
    );
    let temp = tobaccoList.value;

    if (this.tobaccoMasterData) {
      let result = this.tobaccoMasterData.filter(item => {
        let arr = temp.filter(value => {
          if (value.tobaccoUseType != null)
            return value.tobaccoUseType.habitValue == item.habitValue;
        });
        let flag = arr.length == 0 ? true : false;
        return flag;
      });
      this.tobaccoSelectList.push(result.slice());
    }
    tobaccoList.push(this.initTobaccoList());

    if (this.personalHistoryData != null && this.personalHistoryData != undefined ) {
      this.handlePersonalTobaccoHistoryData();
    }

    //Adding Alcohol
    let alcoholList = <FormArray>(
      this.generalPersonalHistoryForm.controls["alcoholList"]
    );
    let tempAlcohol = alcoholList.value;
    if (this.alcoholMasterData) {
      let resultAlcohol = this.alcoholMasterData.filter(itemAlcohol => {
        let arrAlcohol = tempAlcohol.filter(valueAlcohol => {
          if (valueAlcohol.typeOfAlcohol != null)
            return valueAlcohol.typeOfAlcohol.habitValue == itemAlcohol.habitValue;
        });
        let flagAlcohol = arrAlcohol.length == 0 ? true : false;
        return flagAlcohol;
      });
      this.alcoholSelectList.push(resultAlcohol.slice());
    }
    alcoholList.push(this.initAlcoholList());

    if (this.personalHistoryData != null && this.personalHistoryData != undefined ) {
      this.handlePersonalAlcoholHistoryData();
    }

    

  }


  handlePersonalTobaccoHistoryData() {
    let formArray = this.generalPersonalHistoryForm.controls[
      "tobaccoList"
    ] as FormArray;
    if (this.personalHistoryData && this.personalHistoryData.tobaccoList) {
      let temp = this.personalHistoryData.tobaccoList.slice();

      for (let i = 0; i < temp.length; i++) {
        let tobaccoType = this.tobaccoMasterData.filter(item => {
          return item.habitValue == temp[i].tobaccoUseType;
        });

        if (tobaccoType.length > 0) {
          temp[i].tobaccoUseType = tobaccoType[0];
          if(temp[i].numberperDay !== undefined && temp[i].numberperDay !== null) {
             temp[i].number =  temp[i].numberperDay;
             temp[i].perDay = true;
          } else if(temp[i].numberperWeek !== undefined && temp[i].numberperWeek !== null){
             temp[i].number =  temp[i].numberperWeek;
             temp[i].perDay = false;
          }

        }
        if (temp[i].tobaccoUseType) {
          let k = formArray.get("" + i);
          k.patchValue(temp[i]);
          k.markAsTouched();
          this.filterTobaccoList(temp[i].tobaccoUseType, i);
        }

        if (i + 1 < temp.length) this.addTobacco();
      }
    }
  }

  handlePersonalAlcoholHistoryData() {
    let formArray = this.generalPersonalHistoryForm.controls[
      "alcoholList"
    ] as FormArray;
    if (this.personalHistoryData && this.personalHistoryData.alcoholList) {
      let temp = this.personalHistoryData.alcoholList.slice();

      for (let i = 0; i < temp.length; i++) {
        let alcoholType = this.alcoholMasterData.filter(item => {
          return item.habitValue == temp[i].alcoholType;
        });

        if (alcoholType.length > 0) temp[i].typeOfAlcohol = alcoholType[0];

        temp[
          i
        ].avgAlcoholConsumption = this.masterData.quantityOfAlcoholIntake.filter(
          item => {
            return item.habitValue == temp[i].avgAlcoholConsumption;
          }
        )[0];

        if (temp[i].alcoholType) {
          let k = formArray.get("" + i);
          k.patchValue(temp[i]);
          k.markAsTouched();
          this.filterAlcoholList(temp[i].alcoholType, i);
        }

        if (i + 1 < temp.length) this.addAlcohol();
      }
    }
  }

  handlePersonalAllergyHistoryData() {
    let formArray = this.generalPersonalHistoryForm.controls[
      "allergicList"
    ] as FormArray;
    if (this.personalHistoryData && this.personalHistoryData.allergicList) {
      let temp = this.personalHistoryData.allergicList.slice();

      for (let i = 0; i < temp.length; i++) {
        let allergyType = this.allergyMasterData.filter(item => {
          return item.allergyType == temp[i].allergyType;
        });

        // if (this.snomedTerm.length > 0) temp[i].this.snomedTerm = this.snomedTerm[0];
        // if (this.snomedCode.length > 0) temp[i].this.snomedCode = this.snomedCode[0];

        if (allergyType.length > 0) temp[i].allergyType = allergyType[0];

        if(this.masterData.AllergicReactionTypes !== undefined){
        temp[
          i
        ].typeOfAllergicReactions = this.masterData.AllergicReactionTypes.filter(
          item => {
            let flag = false;
            temp[i].typeOfAllergicReactions.forEach(element => {
              if (element.name == item.name) flag = true;
            });
            return flag;
          }
        );
        }

        if (temp[i].otherAllergicReaction) temp[i].enableOtherAllergy = true;

        if (temp[i].allergyType) {
          let k = formArray.get("" + i);
          k.patchValue(temp[i]);
          k.markAsTouched();
          this.filterAlleryList(temp[i].allergyType, i);
        }

        if (i + 1 < temp.length) this.addAllergy();
      }
    }
  }

  addTobacco() {
    let tobaccoList = <FormArray>(
      this.generalPersonalHistoryForm.controls["tobaccoList"]
    );
    let temp = tobaccoList.value;

    if (this.tobaccoMasterData) {
      let result = this.tobaccoMasterData.filter(item => {
        let arr = temp.filter(value => {
          if (value.tobaccoUseType != null)
            return value.tobaccoUseType.habitValue == item.habitValue;
        });
        let flag = arr.length == 0 ? true : false;
        return flag;
      });
      this.tobaccoSelectList.push(result.slice());
    }
    tobaccoList.push(this.initTobaccoList());
  }

  filterTobaccoList(tobacco, i, tobaccoForm?: FormGroup) {
    let previousValue = this.previousSelectedTobaccoList[i];

    if(tobaccoForm && tobacco.tobaccoUseType != 'Other')
    tobacco.patchValue({ otherTobaccoUseType: null });
    if (previousValue) {
      this.tobaccoSelectList.map((item, t) => {
        if (t != i && previousValue.tobaccoUseType != 'Other') {
          item.push(previousValue);
          this.sortTobaccoList(item);
        }
      });
    }

    this.tobaccoSelectList.map((item, t) => {
      let index = item.indexOf(tobacco);
      if (index != -1 && t != i && tobacco.tobaccoUseType != 'Other') item = item.splice(index, 1);
    });

    this.previousSelectedTobaccoList[i] = tobacco;
  }

  removeTobacco(i, tobaccoForm?: FormGroup) {
    this.confirmationService
      .confirm(
        `warn`,
        this.currentLanguageSet.alerts.info.warn
      )
      .subscribe(result => {
        if (result) {
          let tobaccoList = <FormArray>(
            this.generalPersonalHistoryForm.controls["tobaccoList"]
          );
          this.generalPersonalHistoryForm.markAsDirty();
          if (tobaccoList.length == 1 && !!tobaccoForm) {
            tobaccoForm.reset();
          } else {
            let removedValue = this.previousSelectedTobaccoList[i];

            this.tobaccoSelectList.map((item, t) => {
              if (t != i && !!removedValue) {
                item.push(removedValue);
                this.sortTobaccoList(item);
              }
            });

            this.previousSelectedTobaccoList.splice(i, 1);
            this.tobaccoSelectList.splice(i, 1);
            tobaccoList.removeAt(i);
          }
        }
      });
    this.generalPersonalHistoryForm.markAsDirty();
  }

  addAlcohol() {
    let alcoholList = <FormArray>(
      this.generalPersonalHistoryForm.controls["alcoholList"]
    );
    let temp = alcoholList.value;
    if (this.alcoholMasterData) {
      let result = this.alcoholMasterData.filter(item => {
        let arr = temp.filter(value => {
          if (value.typeOfAlcohol != null)
            return value.typeOfAlcohol.habitValue == item.habitValue;
        });
        let flag = arr.length == 0 ? true : false;
        return flag;
      });
      this.alcoholSelectList.push(result.slice());
    }
    alcoholList.push(this.initAlcoholList());
  }

  filterAlcoholList(alcohol, i, alcoholForm?: FormGroup) {
    let previousValue = this.previousSelectedAlcoholList[i];

    if(alcoholForm && alcohol.typeOfAlcohol != 'Other')
    alcoholForm.patchValue({ otherAlcoholType: null });

    if (previousValue) {
      this.alcoholSelectList.map((item, t) => {
        if (t != i && previousValue.typeOfAlcohol != 'Other') {
          item.push(previousValue);
          this.sortAlcoholList(item);
        }
      });
    }

    this.alcoholSelectList.map((item, t) => {
      let index = item.indexOf(alcohol);
      if (index != -1 && t != i && alcohol.typeOfAlcohol != 'Other') item = item.splice(index, 1);
    });

    this.previousSelectedAlcoholList[i] = alcohol;
  }

  removeAlcohol(i, alcoholForm?: FormGroup) {
    this.confirmationService
      .confirm(
        `warn`,
        this.currentLanguageSet.alerts.info.warn
      )
      .subscribe(result => {
        if (result) {
          let alcoholList = <FormArray>(
            this.generalPersonalHistoryForm.controls["alcoholList"]
          );
          this.generalPersonalHistoryForm.markAsDirty();
          if (alcoholList.length == 1 && !!alcoholForm) {
            alcoholForm.reset();
          } else {
            let removedValue = this.previousSelectedAlcoholList[i];

            this.alcoholSelectList.map((item, t) => {
              if (t != i && !!removedValue) {
                item.push(removedValue);
                this.sortAlcoholList(item);
              }
            });

            this.previousSelectedAlcoholList.splice(i, 1);
            this.alcoholSelectList.splice(i, 1);
            alcoholList.removeAt(i);
          }
        }
      });
  }

  addAllergy() {
    let allergicList = <FormArray>(
      this.generalPersonalHistoryForm.controls["allergicList"]
    );
    if (allergicList.length < this.allergyMasterData.length) {
      let temp = allergicList.value;
      if (this.allergyMasterData) {
        let result = this.allergyMasterData.filter(item => {
          let arr = temp.filter(value => {
            if (value.allergyType != null)
              return value.allergyType.allergyType == item.allergyType;
          });
          let flag = arr.length == 0 ? true : false;
          return flag;
        });
        console.log("resultForterm",result);
        
        this.allerySelectList.push(result.slice());
      }
      // allergicList[0].patchValue({allergyName : allergicList.value.snomedTerm})
      
      console.log("allergicList",allergicList);
      allergicList.push(this.initAllergyList());
      console.log("allergicList",allergicList);
    }
  }

  filterAlleryList(allergy, i) {
    let previousValue = this.previousSelectedAlleryList[i];
    if (previousValue) {
      this.allerySelectList.map((item, t) => {
        if (t != i) {
          item.push(previousValue);
          this.sortAllergyList(item);
        }
      });
    }
    this.allerySelectList.map((item, t) => {
      let index = item.indexOf(allergy);
      if (index != -1 && t != i) item = item.splice(index, 1);
    });
    this.previousSelectedAlleryList[i] = allergy;
  }

  removeAllergy(i, allergyForm?: FormGroup) {
    this.confirmationService
      .confirm(
        `warn`,
        this.currentLanguageSet.alerts.info.warn
      )
      .subscribe(result => {
        if (result) {
          let allergicList = <FormArray>(
            this.generalPersonalHistoryForm.controls["allergicList"]
          );
          this.generalPersonalHistoryForm.markAsDirty();
          if (allergicList.length == 1 && !!allergyForm) {
            allergyForm.reset();
            this.selectedSnomedTerm=null;
          } else {
            let removedValue = this.previousSelectedAlleryList[i];
            this.allerySelectList.map((item, t) => {
              if (t != i && !!removedValue) {
                item.push(removedValue);
                this.sortAllergyList(item);
              }
            });
            this.previousSelectedAlleryList.splice(i, 1);
            this.allerySelectList.splice(i, 1);
            allergicList.removeAt(i);
            this.selectedSnomedTerm=null;
          }
        }
      });
  }

  initTobaccoList() {
    return this.fb.group({
      tobaccoUseTypeID: null,
      tobaccoUseType: null,
      otherTobaccoUseType: null,
      number: null,
      numberperDay: null,
      numberperWeek: null,
      perDay : null,
      duration: null,
      durationUnit: null
    });
  }

  initAlcoholList() {
    return this.fb.group({
      alcoholTypeID: null,
      typeOfAlcohol: null,
      otherAlcoholType: null,
      alcoholIntakeFrequency: null,
      avgAlcoholConsumption: null,
      duration: null,
      durationUnit: null
    });
  }

  initAllergyList() {
    return this.fb.group({
      allergyType: null,
      allergyName: null,
      snomedTerm: null,
      snomedCode: null,
      typeOfAllergicReactions: null,
      otherAllergicReaction: null,
      enableOtherAllergy: false
     
    });
  }

  getPreviousTobaccoHistory() {
    let benRegID = localStorage.getItem("beneficiaryRegID");
    this.nurseService
      .getPreviousTobaccoHistory(benRegID, this.visitType)
      .subscribe(
        res => {
          if (res.statusCode == 200 && res.data != null) {
            let title = this.currentLanguageSet.previousTobaccohistoryDet;
            if (res.data.data.length > 0) {
              this.viewPreviousData(res.data, title);
            } else {
              this.confirmationService.alert(this.currentLanguageSet.historyData.ancHistory.previousHistoryDetails.pastHistoryalert);
            }
          } else {
            this.confirmationService.alert(
              this.currentLanguageSet.alerts.info.errorFetchingHistory,
              "error"
            );
          }
        },
        err => {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.errorFetchingHistory,
            "error"
          );
        }
      );
  }

  getPreviousAlcoholHistory() {
    let benRegID = localStorage.getItem("beneficiaryRegID");
    this.nurseService
      .getPreviousAlcoholHistory(benRegID, this.visitType)
      .subscribe(
        res => {
          if (res.statusCode == 200 && res.data != null) {
            let title = this.currentLanguageSet.previousAlcoholhistoryDet;
            if (res.data.data.length > 0) {
              this.viewPreviousData(res.data, title);
            } else {
              this.confirmationService.alert(this.currentLanguageSet.historyData.ancHistory.previousHistoryDetails.pastHistoryalert);
            }
          } else {
            this.confirmationService.alert(
              this.currentLanguageSet.alerts.info.errorFetchingHistory,
              "error"
            );
          }
        },
        err => {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.errorFetchingHistory,
            "error"
          );
        }
      );
  }

  getPreviousAllergyHistory() {
    let benRegID = localStorage.getItem("beneficiaryRegID");
    this.nurseService
      .getPreviousAllergyHistory(benRegID, this.visitType)
      .subscribe(
        res => {
          if (res.statusCode == 200 && res.data != null) {
            let title = this.currentLanguageSet.previousAllergyhistoryDet;
            if (res.data.data.length > 0) {
              this.viewPreviousData(res.data, title);
            } else {
              this.confirmationService.alert(this.currentLanguageSet.historyData.ancHistory.previousHistoryDetails.pastHistoryalert);
            }
          } else {
            this.confirmationService.alert(
              this.currentLanguageSet.alerts.info.errorFetchingHistory,
              "error"
            );
          }
        },
        err => {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.errorFetchingHistory,
            "error"
          );
        }
      );
  }

  viewPreviousData(data, title) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { dataList: data, title: title }
    });
  }

  canEnableOtherAllergy(allergy) {
    let allergicList = allergy.value.typeOfAllergicReactions;
    let flag = false;
    allergicList.forEach(item => {
      if (item.allergicReactionTypeID == 11) flag = true;
    });
    if (!flag) allergy.patchValue({ otherTypeOfAllergicReaction: null });

    allergy.patchValue({ enableOtherAllergy: flag });
  }

  get tobaccoUseStatus() {
    return this.generalPersonalHistoryForm.controls["tobaccoUseStatus"].value;
  }

  get alcoholIntakeStatus() {
    return this.generalPersonalHistoryForm.controls["alcoholIntakeStatus"]
      .value;
  }

  get allergyStatus() {
    return this.generalPersonalHistoryForm.controls["allergyStatus"].value;
  }

  get tobaccoList() {
    return this.generalPersonalHistoryForm.get('tobaccoList') as FormArray;
  }

  perDayChange(){
    console.log("perChange",  this.generalPersonalHistoryForm);
    let validateTobaccoConsumption= this.generalPersonalHistoryForm.controls['tobaccoList'] as FormArray;
    console.log("validateTobaccoConsumption", validateTobaccoConsumption)
    validateTobaccoConsumption.value.forEach((patchNumber, i) => {
      if (patchNumber.perDay !== null && patchNumber.perDay === true) {
        (<FormGroup>validateTobaccoConsumption.at(i)).controls['numberperWeek'].setValue(null);
        (<FormGroup>validateTobaccoConsumption.at(i)).controls['numberperDay'].setValue(patchNumber.number);
        
         
      } else if (patchNumber.perDay !== null && patchNumber.perDay === false) {
         (<FormGroup>validateTobaccoConsumption.at(i)).controls['numberperDay'].setValue(null);
        (<FormGroup>validateTobaccoConsumption.at(i)).controls['numberperWeek'].setValue(patchNumber.number);

      }
    })
    console.log("perChange",  this.generalPersonalHistoryForm);
  }

  validateDuration(formGroup: FormGroup, event?: Event) {
    let duration = null;
    let durationUnit = null;
    let flag = true;

    if (formGroup.value.duration) duration = formGroup.value.duration;

    if (formGroup.value.durationUnit)
      durationUnit = formGroup.value.durationUnit;

    console.log(
      duration,
      durationUnit,
      this.beneficiary,
      this.beneficiary.ageVal
    );

    if (duration != null && durationUnit != null)
      flag = new ValidationUtils().validateDuration(
        duration,
        durationUnit,
        this.beneficiary.age
      );

    if (!flag) {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.durationGreaterThanAge);
      formGroup.patchValue({ duration: null, durationUnit: null });
    }
  }
  checkTobaccoStatus() {
    let tobaccoList = <FormArray>(
      this.generalPersonalHistoryForm.controls["tobaccoList"]
    );
    if (tobaccoList.length > 0) {
      tobaccoList.reset();
    }
  }
  checkAlcoholStatus() {
    let alcoholList = <FormArray>(
      this.generalPersonalHistoryForm.controls["alcoholList"]
    );
    if (alcoholList.length > 0) {
      alcoholList.reset();
    }
  }
  checkAllergicStatus() {
    let allergicList = <FormArray>(
      this.generalPersonalHistoryForm.controls["allergicList"]
    );
    if (allergicList.length > 0) {
      allergicList.reset();
    }
  }

  sortTobaccoList(tobaccoList) {
    tobaccoList.sort((a, b) => {
      if (a.habitValue == b.habitValue) return 0;
      if (a.habitValue < b.habitValue) return -1;
      else return 1;
    });
  }

  sortAlcoholList(alcoholList) {
    alcoholList.sort((a, b) => {
      if (a.habitValue == b.habitValue) return 0;
      if (a.habitValue < b.habitValue) return -1;
      else return 1;
    });
  }

  sortAllergyList(allergyList) {
    allergyList.sort((a, b) => {
      if (a.allergyType == b.allergyType) return 0;
      if (a.allergyType < b.allergyType) return -1;
      else return 1;
    });
  }

  checkTobaccoValidity(tobaccoForm) {
    let temp = tobaccoForm.value;
    if (
      temp.tobaccoUseType &&
      temp.number &&
      temp.duration &&
      temp.durationUnit
    ) {
      return false;
    } else {
      return true;
    }
  }

  checkAlcoholValidity(alcoholForm) {
    let temp = alcoholForm.value;
    if (
      temp.typeOfAlcohol &&
      temp.alcoholIntakeFrequency &&
      temp.avgAlcoholConsumption &&
      temp.duration &&
      temp.durationUnit
    ) {
      return false;
    } else {
      return true;
    }
  }

  checkAllergyValidity(allergyForm) {
    let temp = allergyForm.value;
    if (temp.allergyType && temp.snomedTerm && temp.snomedCode && temp.typeOfAllergicReactions) {
      return false;
    } else {
      return true;
    }
  }



  searchComponents(term: string, i, allergyForm?: FormGroup): void {
    
      let searchTerm = term;
    // let searchTerm = <FormArray>this.generalPersonalHistoryForm.controls['snomedTerm'];allergicList
      // let searchTerm = this.generalPersonalHistoryForm.controls['snomedTerm'];
    console.log("searchTerm",this.generalPersonalHistoryForm);
    if (searchTerm.length > 2) {
        let dialogRef = this.dialog.open(AllergenSearchComponent,
          {data: { searchTerm: searchTerm}});

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result)
            if (result) {
              if( this.generalPersonalHistoryForm.value.allergicList!=undefined &&  this.generalPersonalHistoryForm.value.allergicList.length>0){
             // console.log("check",this.generalPersonalHistoryForm.value.allergicList.at(i).snomedTerm);
              // this.generalPersonalHistoryForm.value.allergicList[0].snomedTerm.patchValue(result.component);
              
              // this.generalPersonalHistoryForm.value.allergicList[0].patchValue({
              //   snomedTerm: result.component})
              // this.generalPersonalHistoryForm.controls['snomedTerm'].setValue(result.component);
              // this.generalPersonalHistoryForm.controls['snomedCode'].setValue(result.componentNo);
              this.selectedSnomedTerm = result.component
              allergyForm.patchValue({ snomedTerm: result.component });
              allergyForm.patchValue({ snomedCode: result.componentNo });
              allergyForm.patchValue({ allergyName: result.component})
              this.countForSearch = i;          



              }
              // this.familyHistoryForm.controls['testLoincCode'].setValue(result.d);
              this.componentFlag=true;
              //  this.generalPersonalHistoryForm.controls['snomedTerm'].disable(); 
              //  this.generalPersonalHistoryForm.controls['snomedCode'].disable();
            
               this.enableAlert=false;
            }
            else
            {
              this.enableAlert=true;
              this.snomedTerm==null;
              this.snomedCode==null;
            }

        })
    }
}

removeSnomedCode(allergyForm , index){
  console.log("value" ,allergyForm.value + "indexx" ,index + "searchTime", this.countForSearch);
  if(this.selectedSnomedTerm == undefined){
    this.countForSearch = index;
    this.selectedSnomedTerm = allergyForm.value.allergyName;
  }
 
  if(this.countForSearch < index){
    this.selectedSnomedTerm = null;
  }
 
  if(this.selectedSnomedTerm && this.selectedSnomedTerm != null){
    if(allergyForm.value.snomedTerm != undefined && allergyForm.value.snomedTerm != null && (allergyForm.value.snomedTerm.trim() != this.selectedSnomedTerm.trim())){
      this.confirmationService.alert( this.currentLanguageSet.historyData.ancHistory
        .personalHistoryANC_OPD_NCD_PNC.snomedTermRemoved);
      allergyForm.patchValue({ snomedCode: null });
      allergyForm.patchValue({ snomedTerm: null });
      allergyForm.patchValue({ allergyName: null });
      this.selectedSnomedTerm = null;
      this.countForSearch = index
      
    }
    else if(allergyForm.value.snomedTerm == null){
     this.confirmationService.alert(this.currentLanguageSet.historyData.ancHistory
      .personalHistoryANC_OPD_NCD_PNC.snomedTermRemoved);
     allergyForm.patchValue({ snomedCode: null });
     allergyForm.patchValue({ snomedTerm: null });
     allergyForm.patchValue({ allergyName: null });
     this.selectedSnomedTerm = null;
     this.countForSearch = index
    }
    
 
  }
  // if(this.countForSearch == 0){
  //   this.confirmationService.alert("Please select a valid snomed code");
  //   allergyForm.patchValue({ snomedTerm: null });
  //   this.countForSearch = 0;

  // }

   
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
