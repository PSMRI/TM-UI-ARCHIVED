import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

export class VisitDetailUtils {

  constructor(private fb: FormBuilder) { }

  createPatientVisitForm(diasableFlag: boolean = false) {
    return this.fb.group({
      patientVisitDetailsForm: this.createPatientVisitDetails(diasableFlag),
      patientChiefComplaintsForm: this.createANCPatientChiefComplaintArrayForm(diasableFlag),
      patientAdherenceForm: this.createPatientAdherenceForm(diasableFlag),
      patientInvestigationsForm: this.createPatientInvestigationsForm(diasableFlag),
      // patientSymptomsForm: this.createPatientSymptomsForm(diasableFlag),
      // patientTravelHistoryForm: this.createPatientTravelHistoryForm(diasableFlag),
      // patientContactHistoryForm: this.createPatientContactHistoryForm(diasableFlag),   
      patientCovidForm : this.createPatientCovidForm(diasableFlag),   
      patientFileUploadDetailsForm: this.createPatientFileUploadDetailsForm(diasableFlag),
      patientDiseaseForm: this.createPatientDiseaseForm(diasableFlag),
      covidVaccineStatusForm: this.createCovidVaccineStatusForm(diasableFlag)
    })
  }

  createPatientAdherenceForm(disableFlag: boolean = false) {
    return this.fb.group({
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      createdBy: null,
      toDrugs: { value: null, disabled: disableFlag },
      drugReason: { value: null, disabled: disableFlag },
      toReferral: { value: null, disabled: disableFlag },
      referralReason: { value: null, disabled: disableFlag },
      progress: { value: null, disabled: disableFlag },
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createPatientInvestigationsForm(disableFlag: boolean = false) {
    return this.fb.group({
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      createdBy: null,
      laboratoryList: { value: [], disabled: disableFlag },
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createANCPatientChiefComplaintArrayForm(disableFlag: boolean = false) {
    return this.fb.group({
      complaints: this.fb.array([
        this.createPatientChiefComplaintsForm(disableFlag)
      ])
    });
  }

  createPatientChiefComplaintsForm(disableFlag): FormGroup {
    return this.fb.group({
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      conceptID: null,
      chiefComplaint: { value: null, disabled: disableFlag },
      chiefComplaintID: { value: null, disabled: disableFlag },
      duration: { value: null, disabled: disableFlag },
      unitOfDuration: { value: null, disabled: disableFlag },
      description: { value: null, disabled: disableFlag },
      createdBy: null,
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createPatientVisitDetails(disableFlag: boolean = false) {
    return this.fb.group({
      beneficiaryRegID: null,
      providerServiceMapID: null,
      visitNo: null,
      visitCode: { value: null, disabled: true },
      visitReason: { value: null, disabled: disableFlag },
      visitCategory: { value: null, disabled: disableFlag },
      pregnancyStatus: { value: null, disabled: disableFlag },
      rCHID: { value: null, disabled: disableFlag },
      healthFacilityType: null,
      healthFacilityLocation: null,
      reportFilePath: null,
      createdBy: null,
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    });
  }

  createPatientFileUploadDetailsForm(disableFlag: boolean = false) {
    return this.fb.group({
      fileIDs: null,
    })
  }

  createPatientDiseaseForm(disableFlag: boolean = false) {
    return this.fb.group({
      diseaseFormsArray: this.fb.array(([]))
    });
  }

  createPatientDiseaseArrayForm(data) {
    if (!data) {
      data = {
        diseaseName: null,
        flag: null,
        selected: null
      }
    }
    return this.fb.group({
      diseaseName: data.disease,
      flag: data.flag,
      selected: data.selected
    });
  }

  createPatientSymptomsForm(disableFlag : boolean = false){
    return this.fb.group({
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      conceptID: null,
      symptoms : {value : null , disabled  :disableFlag},
      createdBy: null,
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }
  createPatientCovidForm(disableFlag : boolean = false){
    return this.fb.group({
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      conceptID: null,
      symptom : {value : null , disabled  :disableFlag},
      contactStatus:{value : null , disabled  :disableFlag},
      travelStatus : {value : null , disabled  :disableFlag},
      //travelType : {value : null , disabled  :disableFlag},
      //domestic : {value : null , disabled  :disableFlag},
      //international : {value : null , disabled  :disableFlag},
      travelList :  this.fb.array([]),
      modeOfTravelDomestic : {value : null , disabled  :disableFlag},
      fromStateDom : {value : null , disabled  :disableFlag},
      fromDistrictDom : {value : null , disabled  :disableFlag},
      fromSubDistrictDom : {value : null , disabled  :disableFlag},
      toStateDom : {value : null , disabled  :disableFlag},
      toDistrictDom:{value : null , disabled  :disableFlag},
      toSubDistrictDom:{value : null , disabled  :disableFlag},
      modeOfTravelInter : {value : null , disabled  :disableFlag},
      fromCountryInter:{value : null , disabled  :disableFlag},
      fromCityInter:{value : null , disabled  :disableFlag},
      toCountryInter:{value : null , disabled  :disableFlag},
      toCityInter:{value : null , disabled  :disableFlag},
      suspectedStatusUI:{value : null , disabled  :disableFlag},
      recommendation :  this.fb.array([]),
      //recommendation:{value : null , disabled  :disableFlag},
      createdBy: null,
      vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }
  // createPatientContactHistoryForm(disableFlag : boolean = false){
  //   return this.fb.group({
  //     beneficiaryRegID: null,
  //     benVisitID: null,
  //     providerServiceMapID: null,
  //     conceptID: null,
  //     contactstatus:{value : null , disabled  :disableFlag},
  //     createdBy: null,
  //     vanID:JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
  //     parkingPlaceID :JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
  //   })
  // }
  createCovidVaccineStatusForm(disableFlag): FormGroup {
    return this.fb.group({
      covidVSID: null,
      ageGroup: null,
      isApplicableForVaccine: null,
      vaccineStatus: null,
      vaccineTypes: null,
      doseTaken: null,
      doseOneDate: null,
      doseTwoDate: null,
      boosterDoseDate: null
    })

  }
}
