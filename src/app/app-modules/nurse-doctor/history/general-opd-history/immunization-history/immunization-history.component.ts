import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { MasterdataService, DoctorService } from '../../../shared/services';
import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';


@Component({
  selector: 'general-immunization-history',
  templateUrl: './immunization-history.component.html',
  styleUrls: ['./immunization-history.component.css']
})
export class ImmunizationHistoryComponent implements OnInit, DoCheck {

  @Input('immunizationHistory')
  immunizationHistoryForm: any;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitType: any;

  masterData: any;
  temp: any;
  beneficiaryAge: any;
  currentLanguageSet: any;

  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
  }
ngOnChanges()
{
 
}
  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
  }

  beneficiaryDetailSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(beneficiary => {
      if (beneficiary !== null && beneficiary.age !== undefined && beneficiary.age !== null) {
        this.beneficiaryAge = beneficiary.age.split('-')[0].trim();
      }
    })
  }

  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData && masterData.childVaccinations) {
        this.nurseMasterDataSubscription.unsubscribe();
        this.masterData = masterData;
        this.getBeneficiaryDetails();
        this.filterImmunizationList(masterData.childVaccinations);
      }
    })
  }

  filterImmunizationList(list) {
    let immunizationAge = [];
    let temp = [];

    list.forEach(element => {
      if (immunizationAge.indexOf(element.vaccinationTime) < 0 && this.getAgeValue(element.vaccinationTime) <= this.getAgeValue(this.beneficiaryAge))
        immunizationAge.push(element.vaccinationTime);
    });

    immunizationAge.sort((prev, next) => {
      return this.getAgeValue(prev) - this.getAgeValue(next);
    })

    immunizationAge.forEach(item => {
      let vaccines = [];
      list.forEach(element => {
        if (element.vaccinationTime == item){
          // vaccines.push({ vaccine: element.vaccineName,sctCode:element.sctCode, sctTerm:element.sctTerm , status: false });
          if(element.sctCode!=null){
            vaccines.push({vaccine: element.vaccineName, sctCode: element.sctCode, sctTerm:element.sctTerm, status: false });
          }
          else{
            vaccines.push({ vaccine: element.vaccineName, sctCode: null, sctTerm:null,status: false });
          }
        }
        })
      temp.push({ defaultReceivingAge: item, vaccines: vaccines });
    });

    this.temp = temp;
    this.initImmunizationForm();
  }

  initImmunizationForm() {
    for (let i = 0; i < this.temp.length; i++) {
      this.addImmunization();
      for (let j = 0; j < this.temp[i].vaccines.length; j++)
        this.addVaccine(i);
    }
    (<FormArray>this.immunizationHistoryForm.controls['immunizationList']).patchValue(this.temp);

    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.loadVaccineData(benRegID, visitID);
    }
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.loadVaccineData(benRegID, visitID);
    }
   
  }

  checkSelectALL = [];
  count: any;
  immunizationHistorySubscription: any;
  loadVaccineData(regId, visitID) {
    this.immunizationHistorySubscription = this.doctorService.getGeneralHistoryDetails(regId, visitID).subscribe(
      history => {
        if (history != null && history.statusCode == 200 && history.data != null && history.data.ImmunizationHistory && history.data.ImmunizationHistory.immunizationList) {
          let temp = history.data.ImmunizationHistory;
          (<FormArray>this.immunizationHistoryForm.controls['immunizationList']).patchValue(temp.immunizationList);
          console.log('temp.immunizationList', temp.immunizationList)

          temp.immunizationList.forEach((immunizationData) => {

            let vaccineStatusCount = 0
            for (let i = 0; i < immunizationData.vaccines.length; i++) {
              if (immunizationData.vaccines[i].status && immunizationData.vaccines[i].status == true) {
                vaccineStatusCount = vaccineStatusCount + 1;
              }
            }

            if (vaccineStatusCount == immunizationData.vaccines.length) {
              this.checkSelectALL.push(true)
            } else {
              this.checkSelectALL.push(false);
            }
          })
        }
      })
  }


  addVaccine(i) {
    let immunizationList = <FormArray>this.immunizationHistoryForm.controls['immunizationList'];
    let vaccineList = (<FormArray>immunizationList.controls[i]).controls['vaccines'];
    vaccineList.push(this.initVaccineList());
  }

  addImmunization() {
    let immunizationList = <FormArray>this.immunizationHistoryForm.controls['immunizationList'];
    immunizationList.push(this.initImmunizationList());
  }

  selectAll(value, i) {
    let immunizationList = <FormArray>this.immunizationHistoryForm.controls['immunizationList'];
    let vaccineList = (<FormArray>immunizationList.controls[i]).controls['vaccines'];
    immunizationList.markAsDirty();

    if (value) {
      vaccineList.controls.forEach((vaccine: FormGroup) => {
        vaccine.patchValue({ status: true });
      })
    } else {
      vaccineList.controls.forEach((vaccine: FormGroup) => {
        vaccine.patchValue({ status: false });
      })
    }

  }

  getAgeValue(age) {
    if (!age) return 0;
    let arr = (age !== undefined && age !== null) ? age.trim().split(' ') : age;
    if (arr[1]) {
      let ageUnit = arr[1];
      if (ageUnit.toLowerCase() == "years")
        return parseInt(arr[0]) * 12 * 30;
      else if (ageUnit.toLowerCase() == 'months')
        return parseInt(arr[0]) * 30;
      else if (ageUnit.toLowerCase() == 'weeks')
        return parseInt(arr[0]) * 7;
    }
    return 0;
  }

  initImmunizationList() {
    return this.fb.group({
      defaultReceivingAge: null,
      vaccines: this.fb.array([]),
    })
  }

  initVaccineList() {
    return this.fb.group({
      vaccine: null,
      sctCode: null,
      sctTerm: null,
      status: null
    })
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
