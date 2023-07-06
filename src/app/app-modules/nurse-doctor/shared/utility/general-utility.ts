import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

export class GeneralUtils {

  constructor(private fb: FormBuilder) { }

  /**
  *  Vitals Form Below
  **/
  createGeneralVitalDetailsForm() {
    return this.fb.group({
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      weight_Kg: null,
      height_cm: null,
      waistCircumference_cm: null,
      hipCircumference_cm: null,
      bMI: null,
      waistHipRatio: null,
      headCircumference_cm: null,
      midUpperArmCircumference_MUAC_cm: null,
      temperature: null,
      pulseRate: null,
      sPO2: null,
      systolicBP_1stReading: null,
      diastolicBP_1stReading: null,
      bloodGlucose_Fasting: null,
      bloodGlucose_Random: null,
      bloodGlucose_2hr_PP: null,
      respiratoryRate: null,
      rbsTestResult: null,
      rbsTestRemarks: null,
      rbsCheckBox: true,
      frequentCoughChecked: null,
      sputumChecked : null,
      coughAtNightChecked: null,
      wheezingChecked: null,
      painInChestChecked: null,
      shortnessOfBreathChecked: null,
      createdBy: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    });
  }

  /**
  *  Examination Forms Below
  **/
  createPatientExaminationForm() {
    return this.fb.group({
      generalExaminationForm: this.createGeneralExaminationForm(),
      headToToeExaminationForm: this.createHeadToToeExaminationForm(),
      systemicExaminationForm: this.createSystemicExaminationForm()
    })
  }

  /**
  *  General Examination Form Below ** Part of Examination Form
  **/
  createGeneralExaminationForm() {
    return this.fb.group({
      consciousness: null,
      coherence: null,
      cooperation: null,
      comfortness: null,
      builtAndAppearance: null,
      gait: null,
      dangerSigns: null,
      typeOfDangerSigns: [],
      pallor: null,
      quickening: null,
      foetalMovements: null,
      jaundice: null,
      cyanosis: null,
      clubbing: null,
      lymphadenopathy: null,
      lymphnodesInvolved: null,
      typeOfLymphadenopathy: null,
      edema: null,
      extentOfEdema: null,
      edemaType: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  /**
  * Head to Toe Examination Form ** Part of Examination Form
  **/
  createHeadToToeExaminationForm() {
    return this.fb.group({
      headtoToeExam: null,
      head: null,
      eyes: null,
      ears: null,
      nose: null,
      oralCavity: null,
      throat: null,
      breastAndNipples: null,
      trunk: null,
      upperLimbs: null,
      lowerLimbs: null,
      skin: null,
      hair: null,
      nails: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  /**
  * Systemic Examination Form ** Part of Examination Form
  **/
  createSystemicExaminationForm() {
    return this.fb.group({
      gastroIntestinalSystemForm: this.createGastroIntestinalSystemForm(),
      cardioVascularSystemForm: this.createCardioVascularSystemForm(),
      respiratorySystemForm: this.createRespiratorySystemForm(),
      centralNervousSystemForm: this.createCentralNervousSystemForm(),
      musculoSkeletalSystemForm: this.createMusculoSkeletalSystemForm(),
      genitoUrinarySystemForm: this.createGenitoUrinarySystemForm(),
    })
  }

  /**
  * Gastro Intestinal System Form ** Part of Systemic Examination Form ** Part of Examination Form
  **/
  createGastroIntestinalSystemForm() {
    return this.fb.group({
      inspection: null,
      palpation_AbdomenTexture: null,
      palpation_Liver: null,
      palpation_Spleen: null,
      palpation_Tenderness: null,
      palpation_LocationOfTenderness: null,
      percussion: null,
      auscultation: null,
      analRegion: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  /**
  * Cardio Vascular System Form ** Part of Systemic Examination Form ** Part of Examination Form
  **/
  createCardioVascularSystemForm() {
    return this.fb.group({
      jugularVenousPulse_JVP: null,
      apexbeatLocation: null,
      apexbeatType: null,
      firstHeartSound_S1: null,
      secondHeartSound_S2: null,
      additionalHeartSounds: null,
      murmurs: null,
      pericardialRub: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  /**
  * Respiratory System Form ** Part of Systemic Examination Form ** Part of Examination Form
  **/
  createRespiratorySystemForm() {
    return this.fb.group({
      trachea: null,
      inspection: null,
      signsOfRespiratoryDistress: null,
      palpation: null,
      auscultation_Stridor: null,
      auscultation_BreathSounds: null,
      auscultation_Crepitations: null,
      auscultation_Wheezing: null,
      auscultation_PleuralRub: null,
      auscultation_ConductedSounds: null,
      percussion: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  /**
  * Central Nervous System Form ** Part of Systemic Examination Form ** Part of Examination Form
  **/
  createCentralNervousSystemForm() {
    return this.fb.group({
      handedness: null,
      cranialNervesExamination: null,
      motorSystem: null,
      sensorySystem: null,
      autonomicSystem: null,
      cerebellarSigns: null,
      signsOfMeningealIrritation: null,
      skull: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  /**
  * Musculo Skeletal System Form ** Part of Systemic Examination Form ** Part of Examination Form
  **/
  createMusculoSkeletalSystemForm() {
    return this.fb.group({
      joint_TypeOfJoint: null,
      joint_Laterality: null,
      joint_Abnormality: null,
      upperLimb_Laterality: null,
      upperLimb_Abnormality: null,
      lowerLimb_Laterality: null,
      lowerLimb_Abnormality: null,
      chestWall: null,
      spine: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  /**
  * Genito Urinary System Form ** Part of Systemic Examination Form ** Part of Examination Form
  **/
  createGenitoUrinarySystemForm() {
    return this.fb.group({
      renalAngle: null,
      suprapubicRegion: null,
      externalGenitalia: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  /**
   * obstetric Examination Form ** Part of Systemic Examination Form ** Part of Examination Form
   * ## Control added to Systemic form in Systemic Component if Visit Categor is ANC
   **/
  createObstetricExaminationForANCForm() {
    return this.fb.group({
      fundalHeight: null,
      fHAndPOA_Status: null,
      fHAndPOA_Interpretation: null,
      fetalMovements: null,
      fetalHeartSounds: null,
      fetalHeartRate_BeatsPerMinute: null,
      fetalPositionOrLie: null,
      fetalPresentation: null,
      abdominalScars: null,
      sfh: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  /**
   * ANC Forms
   */
  createPatientANCDetailsForm() {
    return this.fb.group({
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      createdBy: null,
      primiGravida: null,
      lmpDate: null,
      gestationalAgeOrPeriodofAmenorrhea_POA: null,
      expDelDt: null,
      duration: null,
      trimesterNumber: null,
      bloodGroup: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })

  }

  createPatientANCImmunizationForm() {
    return this.fb.group({
      tT_1Status: null,
      dateReceivedForTT_1: null,
      facilityNameOfTT_1: null,
      tT_2Status: null,
      dateReceivedForTT_2: null,
      facilityNameOfTT_2: null,
      tT_3Status: null,
      dateReceivedForTT_3: null,
      facilityNameOfTT_3: null,
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      createdBy: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createObstetricFormulaForm() {
    return this.fb.group({
      gravida_G: null,
      termDeliveries_T: null,
      pretermDeliveries_P: null,
      abortions_A: null,
      stillBirth: null,
      livebirths_L: null,
      bloodGroup: null,
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      createdBy: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createPatientANCForm() {
    return this.fb.group({
      patientANCDetailsForm: this.createPatientANCDetailsForm(),
      patientANCImmunizationForm: this.createPatientANCImmunizationForm(),
      obstetricFormulaForm: this.createObstetricFormulaForm()
    })
  }

  /**
   * General History Forms
   */
  createGeneralHistoryForm(disableFlag?: boolean) {
    return this.fb.group({
      pastHistory: this.createPastHistoryForm(),
      comorbidityHistory: this.createComorbidityConcurrentConditionsForm(),
      medicationHistory: this.createMedicationHistoryForm(),
      personalHistory: this.createGeneralPersonalHistoryForm(),
      familyHistory: this.createFamilyHistoryForm(),
      menstrualHistory: this.createMenstrualHistoryForm(disableFlag),
      perinatalHistory: this.createPerinatalHistoryForm(),
      pastObstericHistory: this.createPastObstericHistoryForm(),
      immunizationHistory: this.createImmunizationHistoryForm(),
      otherVaccines: this.createOtherVaccinesForm(),
      feedingHistory: this.createFeedingHistoryForm(),
      developmentHistory: this.createDevelopmentHistoryForm()
    })
  }

  createComorbidityConcurrentConditionsForm() {
    return this.fb.group({
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      comorbidityConcurrentConditionsList: new FormArray([])
    })
  }

  createDevelopmentHistoryForm() {
    return this.fb.group({
      grossMotorMilestones: null,
      fineMotorMilestones: null,
      socialMilestones: null,
      languageMilestones: null,
      developmentProblems: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createFamilyHistoryForm() {
    return this.fb.group({
      familyDiseaseList: new FormArray([]),
      isGeneticDisorder: null,
      geneticDisorder: null,
      isConsanguineousMarrige: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createFeedingHistoryForm() {
    return this.fb.group({
      typeOfFeed: null,
      compFeedStartAge: null,
      noOfCompFeedPerDay: null,
      foodIntoleranceStatus: null,
      typeofFoodIntolerance: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    });
  }

  createMedicationHistoryForm() {
    return this.fb.group({
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      medicationHistoryList: new FormArray([])
    })
  }

  createImmunizationHistoryForm() {
    return this.fb.group({
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      immunizationList: new FormArray([])
    })
  }

  createMenstrualHistoryForm(disableFlag = true) {
    return this.fb.group({
      menstrualCycleStatus: null,
      menstrualCycleStatusID: null,
      regularity: null,
      cycleLength: null,
      menstrualCyclelengthID: null,
      menstrualFlowDurationID: null,
      bloodFlowDuration: null,
      menstrualProblemList: null,
      lMPDate: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createOtherVaccinesForm() {
    return this.fb.group({
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      otherVaccines: this.fb.array([])
    })
  }

  createPastHistoryForm() {
    return this.fb.group({
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      pastIllness: new FormArray([]),
      pastSurgery: new FormArray([])
    });
  }

  createPastObstericHistoryForm() {
    return this.fb.group({
      totalNoOfPreg: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      complicationPregList: new FormArray([]),
      pastObstericHistoryList: new FormArray([])
    })
  }

  initPastObstericHistory(number) {
    return this.fb.group({
      pregOrder: number,
      pregComplicationList: null,
      otherPregComplication: null,

      pregDurationID: null,
      durationType: null,
      deliveryTypeID: null,
      deliveryType: null,
      deliveryPlaceID: null,
      deliveryPlace: null,
      otherDeliveryPlace: null,

      deliveryComplicationList: null,
      otherDeliveryComplication: null,

      postpartumComplicationList: null,
      otherPostpartumCompType: null,

      pregOutcomeID: null,
      pregOutcome: null,

      // postNatalComplicationID: null,
      // postNatalComplication: null,
      // otherPostNatalComplication: null,

      newBornComplicationID: null,
      newBornComplication: null,
      otherNewBornComplication: null,
      congenitalAnomalies: null,

      pregDuration:null,
      abortionType:null,
      typeofFacility:null,
      postAbortionComplication:null
    })
  }

  createPerinatalHistoryForm() {
    return this.fb.group({
      deliveryPlaceID: null,
      placeOfDelivery: null,
      otherPlaceOfDelivery: null,
      deliveryTypeID: null,
      typeOfDelivery: null,
      complicationAtBirthID: null,
      complicationAtBirth: null,
      otherComplicationAtBirth: null,
      gestation: null,
      birthWeight_kg: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createGeneralPersonalHistoryForm() {
    return this.fb.group({
      dietaryType: null,
      physicalActivityType: null,
      riskySexualPracticesStatus: null,
      tobaccoUseStatus: null,
      alcoholIntakeStatus: null,
      allergyStatus: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      tobaccoList: new FormArray([]),
      alcoholList: new FormArray([]),
      allergicList: new FormArray([])
    });
  }

  /**
   * Case-Sheet form
   */

  createGeneralFindingsForm() {
    return this.fb.group({
      beneficiaryRegID: null,
      benVisitID: null,
      providerServiceMapID: null,
      clinicalObservation: null,
      otherSymptoms: null,
      significantFindings: null,
      isForHistory: null,
      complaints: this.fb.array([this.initChiefComplaints()]),
      createdBy: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    });
  }

  initChiefComplaints(): FormGroup {
    return this.fb.group({
      chiefComplaint: null,
      chiefComplaintID: null,
      duration: null,
      conceptID: null,
      unitOfDuration: null,
      description: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createGeneralDiagnosisForm() {
    return this.fb.group({
      instruction: null,
      prescriptionID: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
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
  initConfirmatoryDiagnosisList() {
    return this.fb.group({
      conceptID: [null, Validators.required],
      term: [null, Validators.required],
      viewConfirmatoryDiagnosisProvided: [null, Validators.required],
    })
  }

  createANCDiagnosisForm() {
    return this.fb.group({      
      gravida_G: null,
      duration: null,
      highRiskStatus: null,
      highRiskCondition: null,
      complicationOfCurrentPregnancyList: null,
      otherCurrPregComplication: null,
      isMaternalDeath: null,
      placeOfDeath: null,
      dateOfDeath: null,
      causeOfDeath: null,
      prescriptionID: null,
      specialistDiagnosis : null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createNCDCareDiagnosisForm() {
    return this.fb.group({
     // ncdScreeningConditionID: null,
     ncdScreeningConditionArray: [null, Validators.required],
     ncdScreeningConditionOther:null,
     ncdCareTypeID: null,
     ncdCareType: null,
     ncdComplication: null,
     prescriptionID: null,
     specialistDiagnosis : null,
     vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
     parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
     provisionalDiagnosisList: this.fb.array([this.initProvisionalDiagnosisList()])
    })
  }
  

  createCovidDiagnosisForm() {
    return this.fb.group({
      prescriptionID : null,
      specialistDiagnosis: null,
      doctorDiagnosis: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    });
  }

  createPNCDiagnosisForm() {
    return this.fb.group({
      provisionalDiagnosisList: this.fb.array([this.initProvisionalDiagnosisList()]),
      confirmatoryDiagnosisList: this.fb.array([this.initConfirmatoryDiagnosisList()]),
      isMaternalDeath: null,
      placeOfDeath: null,
      dateOfDeath: null,
      causeOfDeath: null,
      prescriptionID: null,
      specialistDiagnosis : null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

  createGeneraldoctorinvestigationForm() {
    return this.fb.group({
      labTest: null,
      radiologyTest: null,
      externalInvestigations: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    });
  }

  createDrugPrescriptionForm() {
    return this.fb.group({
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
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
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      isEDL: prescription.isEDL
    });
  }


  createGeneralCaseRecord() {
    return this.fb.group({
      generalFindingsForm: this.createGeneralFindingsForm(),
      generalDiagnosisForm: this.createGeneralDiagnosisForm(),
      generalDoctorInvestigationForm: this.createGeneraldoctorinvestigationForm(),
      drugPrescriptionForm: this.createDrugPrescriptionForm()
    })
  }
  createNCDScreeningCaseRecord() {
    return this.fb.group({
      generalFindingsForm: this.createGeneralFindingsForm(),
      generalDiagnosisForm: this.createNCDScreeningDiagnosisForm(),
      generalDoctorInvestigationForm: this.createGeneraldoctorinvestigationForm(),
      drugPrescriptionForm: this.createDrugPrescriptionForm()
    })
  }
  createNCDScreeningDiagnosisForm() {
    return this.fb.group({
      instruction: null,
      prescriptionID: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      provisionalDiagnosisList: this.fb.array([this.initProvisionalDiagnosisList()]),
      diabetesConfirmed: null,
      hypertensionConfirmed: null
    });
  }
  createANCCaseRecord() {
    return this.fb.group({
      generalFindingsForm: this.createGeneralFindingsForm(),
      generalDiagnosisForm: this.createANCDiagnosisForm(),
      generalDoctorInvestigationForm: this.createGeneraldoctorinvestigationForm(),
      drugPrescriptionForm: this.createDrugPrescriptionForm()
    })
  }

  createNCDCareCaseRecord() {
    return this.fb.group({
      generalFindingsForm: this.createGeneralFindingsForm(),
      generalDiagnosisForm: this.createNCDCareDiagnosisForm(),
      generalDoctorInvestigationForm: this.createGeneraldoctorinvestigationForm(),
      drugPrescriptionForm: this.createDrugPrescriptionForm()
    })
  }

  createCovidCaseRecord() {
    return this.fb.group({
      generalFindingsForm: this.createGeneralFindingsForm(),
      generalDiagnosisForm: this.createCovidDiagnosisForm(),
      generalDoctorInvestigationForm: this.createGeneraldoctorinvestigationForm(),
      drugPrescriptionForm: this.createDrugPrescriptionForm()
    })
  }

  createPNCCaseRecord() {
    return this.fb.group({
      generalFindingsForm: this.createGeneralFindingsForm(),
      generalDiagnosisForm: this.createPNCDiagnosisForm(),
      generalDoctorInvestigationForm: this.createGeneraldoctorinvestigationForm(),
      drugPrescriptionForm: this.createDrugPrescriptionForm()
    })
  }

  createPatientPNCForm() {
    return this.fb.group({
      deliveryPlace: null,
      otherDeliveryPlace: null,
      deliveryType: null,
      dDate: null,
      deliveryComplication: null,
      otherDeliveryComplication: null,
      pregOutcome: null,
      postNatalComplication: null,
      otherPostNatalComplication: null,
      gestationName: null,
      birthWeightOfNewborn: null,
      newBornHealthStatus: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }
   /**
   * NCD Screening History Forms
   */
  createNCDScreeningHistoryForm(disableFlag?: boolean) {
    return this.fb.group({
      physicalActivityHistory: this.createPhysicalActivityHistoryForm(),
      familyHistory: this.createNCDScreeningFamilyHistoryForm(),
      personalHistory: this.createGeneralPersonalHistoryForm(),
    })
  }

  createPhysicalActivityHistoryForm() {
    return this.fb.group({
      ID:null,
      physicalActivityType: null,
      activityType : null,
      pAID : null,
      score : null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID
    });
  }

  createNCDScreeningFamilyHistoryForm() {
    return this.fb.group({
      familyDiseaseList: new FormArray([]),
      isGeneticDisorder: null,
      geneticDisorder: null,
      isConsanguineousMarrige: null,
      vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
    })
  }

}
