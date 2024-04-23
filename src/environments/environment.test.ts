/* 
* AMRIT � Accessible Medical Records via Integrated Technology 
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


// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const commonIP = 'http://10.208.122.38:8080/';
const tmIP = 'http://10.208.122.38:8080/';
const mmuIP = 'http://10.208.122.38:8080/';
const schedulerIP = 'http://10.208.122.38:8080/';
const tmUI_IP = 'http://10.208.122.38:8080/';
const schedulerUI_IP = 'http://10.208.122.38:8080/';
const inventoryUI_IP = 'http://10.208.122.38:8080/';
const SERVER_IP = 'dataSYNCIP';
const SWYMED_IP = 'swymed://14.143.13.109';
const adminIP = "http://10.208.122.38:8080";
const FHIRIP = "http://10.208.122.38:8080";
// With API MAN Configuration
// const COMMON_API_OPEN = `http://${IP}:8080/apiman-gateway/IEMR/Common/open/`;
//const TM_API = `http://${IP}:8080/apiman-gateway/IEMR/TM/1.0/`;
// const COMMON_API = `http://${IP}:8080/apiman-gateway/IEMR/Common/open/`;
// const MMU_API = `http://${IP}:8080/apiman-gateway/IEMR/MMU/1.0/`;
//  const SCHEDULER_API = `http://${IP}:8080/apiman-gateway/IEMR/Scheduling/1.0/`;

// Without API MAN Configuration
const COMMON_API_OPEN = `${commonIP}commonapi-v1.0/`;
const COMMON_API = `${commonIP}commonapi-v1.0/`;
const TM_API = `${tmIP}tmapi-v1.0/`;
const MMU_API = `${mmuIP}mmuapi-v1.0/`
const COMMON_API_OPEN_SYNC = `${SERVER_IP}commonapi-v1.0/`;
const SCHEDULER_API = `${schedulerIP}schedulerapi-v1.0/`;
const ADMIN_API = `${adminIP}/adminapi-v1.0`;
const biologicalScreeningDeviceAPI = `${ADMIN_API}/diagnostics/biologicalScreeningDevice`; 
const FHIR_API = `${FHIRIP}/fhirapi-v1.0/`;
const mmuUICasesheet = `${tmUI_IP}tmui-v1.0`;

export const environment = {
  production: true,
  isTMOffline: false,

  app: `MMU`,
  RBSTest:`RBS Test`,
  visualAcuityTest:`Visual Acuity Test`,
  haemoglobinTest : `Haemoglobin Test`,
  abhaExtension: `@abdm`,
  parentAPI: `${TM_API}`,

  INVENTORY_URL: `${inventoryUI_IP}/inventory-ui-v1.0/#/redirin?`,
  fallbackUrl: `/pharmacist/redirfallback`,
  redirInUrl: `/pharmacist/redirin`,

  TELEMEDICINE_URL: `${schedulerUI_IP}/schedulerui-v1.0/#/?`,
  fallbackMMUUrl: `/logout-tm`,
  redirInMMUUrl: `/common/tcspecialist-worklist`,

  getSessionExistsURL: `${COMMON_API_OPEN}user/getLoginResponse`,
  extendSessionUrl: `${TM_API}common/extend/redisSession`,

 /**
   * comman API for fetching state and cities
   */

  getStateName: `${COMMON_API}location/states/`,
  getDistrictName: `${COMMON_API}location/districts/`,
  getSubDistrictName: `${COMMON_API}location/taluks/`,
  getCountryName: `${TM_API}location/get/countryMaster`,
  getCityName: `${TM_API}location/get/countryCityMaster/`,
  saveDoctorNCDScreeningDetails: `${TM_API}NCD/save/doctorData`,


  /**
   * Login and Logout Urls
   */
  syncLoginUrl: `${COMMON_API_OPEN_SYNC}user/userAuthenticate`,
  loginUrl: `${COMMON_API_OPEN}user/userAuthenticate`,
  logoutUrl: `${COMMON_API_OPEN}user/userLogout`,
  userLogoutPreviousSessionUrl:  `${COMMON_API_OPEN}user/logOutUserFromConcurrentSession`,

  /**
   * Security Question and Forgot password Url
   */
  getUserSecurityQuestionsAnswerUrl: `${COMMON_API_OPEN}user/forgetPassword`,
  getSecurityQuestionUrl: `${COMMON_API_OPEN}user/getsecurityquetions`,
  saveUserSecurityQuestionsAnswerUrl: `${COMMON_API_OPEN}user/saveUserSecurityQuesAns`,
  setNewPasswordUrl: `${COMMON_API_OPEN}user/setForgetPassword`,

  servicePointUrl: `${TM_API}user/getUserVanSpDetails`,
  servicePointVillages: `${TM_API}user/getServicepointVillages`,

  registerBeneficiaryUrl: `${TM_API}registrar/registrarBeneficaryRegistration/`,
  updateBeneficiaryUrl: `${TM_API}registrar/update/BeneficiaryDetails`,
  submitBeneficiaryIdentityUrl: `${TM_API}registrar/registrarBeneficaryRegistrationNew`,
  updateBeneficiaryIdentityUrl: `${TM_API}registrar/update/BeneficiaryUpdate`,

  registrarMasterDataUrl: `${TM_API}registrar/registrarMasterData`,
  quickSearchUrl: `${TM_API}registrar/quickSearch`,
  identityQuickSearchUrl: `${TM_API}registrar/quickSearchNew`,
  advanceSearchUrl: `${TM_API}registrar/advanceSearch`,
  advanceSearchIdentityUrl: `${TM_API}registrar/advanceSearchNew`,
  externalSearchIdentityUrl: `${FHIR_API}patient/data/profile/search/demographic`,
  patientRevisitSubmitToNurse: `${TM_API}common/update/benDetailsAndSubmitToNurse`,
  identityPatientRevisitSubmitToNurseURL: `${TM_API}registrar/create/BenReVisitToNurse`,
  /**
   * Master Data Urls
   */
  previousVisitDataUrl:`${TM_API}common/getBenSymptomaticQuestionnaireDetails`,
  getDistrictListUrl: `${TM_API}location/get/districtMaster/`,
  getSubDistrictListUrl: `${TM_API}location/get/districtBlockMaster/`,
  getVillageListUrl: `${TM_API}location/get/villageMasterFromBlockID/`,
  demographicsCurrentMasterUrl: `${TM_API}location/getLocDetailsBasedOnSpIDAndPsmID`,
  visitDetailMasterDataUrl: `${TM_API}master/get/visitReasonAndCategories`,
  nurseMasterDataUrl: `${TM_API}master/nurse/masterData/`,
  doctorMasterDataUrl: `${TM_API}master/doctor/masterData/`,
  snomedCTRecordURL: `${TM_API}/snomed/getSnomedCTRecord`,
  getCalibrationStrips: `${ADMIN_API}/fetchCalibrationStrips`,
  /**
   * Lab Data Urls
   */

  getprescribedTestDataUrl: `${TM_API}labTechnician/get/prescribedProceduresList`,
  labSaveWork: `${TM_API}labTechnician/save/LabTestResult`,

  /**
   * Worklist Urls
   */

  nurseWorklist: `${TM_API}common/getNurseWorklistNew/`,
  getNurseTMWorklistUrl: `${TM_API}common/getNurseWorkListTcCurrentDate/`,
  getNurseTMFutureWorklistUrl: `${TM_API}common/getNurseWorkListTcFutureDate/`,
  labWorklist: `${TM_API}common/getLabWorklistNew/`,
  doctorWorkList: `${TM_API}common/getDocWorklistNew/`,
  doctorFutureWorkList: `${TM_API}common/getDocWorkListNewFutureScheduledForTM/`,
  specialistWorkListURL: `${TM_API}common/getTCSpecialistWorklist/`,
  specialistFutureWorkListURL: `${TM_API}common/getTCSpecialistWorklistFutureScheduled/`,
  radiologistWorklist: `${TM_API}common/getRadiologist-worklist-New/`,
  oncologistWorklist: `${TM_API}common/getOncologist-worklist-New/`,
  pharmacistWorklist: `${TM_API}common/getPharma-worklist-New/`,


  // New API
  getBeneficiaryDetail: `${TM_API}registrar/get/benDetailsByRegIDForLeftPanelNew`,

  getCompleteBeneficiaryDetail: `${TM_API}registrar/get/beneficiaryDetails`,

  // getBeneficiaryImage: `${TM_API}registrar/get/beneficiaryImage`,
  // New API
  getBeneficiaryImage: `${TM_API}registrar/getBenImage`,
  getPreviousVisitDetailsUrl: `${TM_API}casesheet/getBeneficiaryCaseSheetHistory`,
  updateVisitStatus: `${TM_API}doctor/updateBeneficiaryStatus`,

  // printCancerCase_sheet_url: `${mmuUICasesheet}`,
  // updateOncologistRemarksCancelUrl: `${TM_API}oncologist/update/examinationScreen/diagnosis`,
  updateOncologistRemarksCancelUrl: `${TM_API}CS-cancerScreening/update/examinationScreen/diagnosis`,
  //commented by NEERAJ on 06-03-2018, because modified the url
  //getStatesURL: `${COMMON_API}location/states/`,
  //getDistrictsURL: `${COMMON_API}location/districts/`,

  getStatesURL: `${TM_API}location/get/stateMaster`,
  getDistrictsURL: `${TM_API}location/get/districtMaster/`,
  countryId: 1,

  /**
   * NCD SCREENING API URLs
   */
  postNCDScreeningDetails: `${TM_API}NCD/save/nurseData`,
  // getNCDScreeningVisitDetails: `${TM_API}CS-cancerScreening/getBenDataFrmNurseToDocVisitDetailsScreen`,
  getNCDScreeningVisitDetails: `${TM_API}NCD/getBenVisitDetailsFrmNurseNCDScreening`,
  getNCDScreeningDetails: `${TM_API}NCD/get/nurseData`,
  updateNCDScreeningDetails: `${TM_API}NCD/update/nurseData`,
  getNCDScreeningIDRSDetails : `${TM_API}NCD/getBenIdrsDetailsFrmNurse`,
  updateNCDVitalsDetailsUrl:`${TM_API}NCD/update/vitalScreen`,
  updateNCDScreeningHistoryDetailsUrl :`${TM_API}NCD/update/historyScreen`,
  getNCDScreeningHistoryDetails : `${TM_API}NCD/getBenHistoryDetails`,
  getNCDSceeriningVitalDetails : `${TM_API}NCD/getBenVitalDetailsFrmNurse`,
  updateNCDScreeningIDRSDetailsUrl :`${TM_API}NCD/update/idrsScreen`,

  

  /**
   * GENERAL OPD QUICK CONSULT API URLs
   */
  saveNurseGeneralQuickConsult: `${TM_API}genOPD-QC-quickConsult/save/nurseData`,
  saveDoctorGeneralQuickConsult: `${TM_API}genOPD-QC-quickConsult/save/doctorData`,

  getGeneralOPDQuickConsultVisitDetails: `${TM_API}genOPD-QC-quickConsult/getBenDataFrmNurseToDocVisitDetailsScreen`,
  getGeneralOPDQuickConsultVitalDetails: `${TM_API}genOPD-QC-quickConsult/getBenVitalDetailsFrmNurse`,


  /**
   * ANC API URLs
   */
  saveNurseANCDetails: `${TM_API}ANC/save/nurseData`,
  saveDoctorANCDetails: `${TM_API}ANC/save/doctorData`,

  getANCVisitDetailsUrl: `${TM_API}ANC/getBenVisitDetailsFrmNurseANC`,
  getANCDetailsUrl: `${TM_API}ANC/getBenANCDetailsFrmNurseANC`,
  getANCVitalsDetailsUrl: `${TM_API}ANC/getBenANCVitalDetailsFrmNurseANC`,
  getANCHistoryDetailsUrl: `${TM_API}ANC/getBenANCHistoryDetails`,
  getANCExaminationDataUrl: `${TM_API}ANC/getBenExaminationDetailsANC`,

  updateANCVisitDetailsUrl: `${TM_API}ANC/update/visitDetailsScreen`,
  updateANCDetailsUrl: `${TM_API}ANC/update/ANCScreen`,
  updateANCVitalsDetailsUrl: `${TM_API}ANC/update/vitalScreen`,
  updateANCHistoryDetailsUrl: `${TM_API}ANC/update/historyScreen`,
  updateANCExaminationDetailsUrl: `${TM_API}ANC/update/examinationScreen`,

   /**ANC FoetalMonitor API URLs */
   savefetosenseTestDetailsUrl: `${TM_API}/foetalMonitor/sendMotherTestDetailsToFoetalMonitor`,
   getPrescribedFetosenseTests: `${TM_API}/foetalMonitor/fetch/foetalMonitorDetails/`,

  /**
   * CANCER SCREENING API URLs
   */
  saveNurseCancerScreeningDetails: `${TM_API}CS-cancerScreening/save/nurseData`,
  saveDoctorCancerScreeningDetails: `${TM_API}CS-cancerScreening/save/doctorData`,

  getCancerScreeningVisitDetails: `${TM_API}CS-cancerScreening/getBenDataFrmNurseToDocVisitDetailsScreen`,
  getCancerScreeningHistoryDetails: `${TM_API}CS-cancerScreening/getBenDataFrmNurseToDocHistoryScreen`,
  getCancerScreeningVitalsDetails: `${TM_API}CS-cancerScreening/getBenDataFrmNurseToDocVitalScreen`,
  getCancerScreeningExaminationDetails: `${TM_API}CS-cancerScreening/getBenDataFrmNurseToDocExaminationScreen`,

  previousCancerFamilyHistoryUrl: `${TM_API}CS-cancerScreening/getBenCancerFamilyHistory`,
  previousCancerPersonalHabitHistoryUrl: `${TM_API}CS-cancerScreening/getBenCancerPersonalHistory`,
  previousCancerPersonalDietHistoryUrl: `${TM_API}CS-cancerScreening/getBenCancerPersonalDietHistory`,
  previousCancerPastObstetricHistoryUrl: `${TM_API}CS-cancerScreening/getBenCancerObstetricHistory`,

  updateCancerScreeningHistory: `${TM_API}CS-cancerScreening/update/historyScreen`,
  updateCancerScreeningVitals: `${TM_API}CS-cancerScreening/update/vitalScreen`,
  updateCancerScreeningExamination: `${TM_API}CS-cancerScreening/update/examinationScreen`,

  getCancerScreeningCaseSheet: `${TM_API}CS-cancerScreening/getBeneficiaryDataEnteredByNurseAndDoctor`,

  /**
   * GENERAL OPD API URLs
   */
  saveNurseGeneralOPDDetails: `${TM_API}generalOPD/save/nurseData`,

  updateGeneralOPDHistoryDetailsUrl: `${TM_API}generalOPD/update/historyScreen`,
  updateGeneralOPDVitalsDetailsUrl: `${TM_API}/generalOPD/update/vitalScreen`,
  updateGeneralOPDExaminationDetailsUrl: `${TM_API}/generalOPD/update/examinationScreen`,

  saveDoctorGeneralOPDDetails: `${TM_API}generalOPD/save/doctorData`,

  getGeneralOPDVisitDetailsUrl: `${TM_API}generalOPD/getBenVisitDetailsFrmNurseGOPD`,
  getGeneralOPDHistoryDetailsUrl: `${TM_API}generalOPD/getBenHistoryDetails`,
  getGeneralOPDVitalDetailsUrl: `${TM_API}generalOPD/getBenVitalDetailsFrmNurse`,
  getGeneralOPDExaminationDetailsUrl: `${TM_API}generalOPD/getBenExaminationDetails`,

  /**
   * NCD Care API Urls
   */
  saveNurseNCDCareDetails: `${TM_API}NCDCare/save/nurseData`,

  saveDoctorNCDCareDetails: `${TM_API}NCDCare/save/doctorData`,

  updateNCDCareHistoryDetailsUrl: `${TM_API}NCDCare/update/historyScreen`,
  updateNCDCareVitalsDetailsUrl: `${TM_API}NCDCare/update/vitalScreen`,

  getNCDCareVisitDetailsUrl: `${TM_API}NCDCare/getBenVisitDetailsFrmNurseNCDCare`,
  getNCDCareHistoryDetailsUrl: `${TM_API}NCDCare/getBenNCDCareHistoryDetails`,
  getNCDCareVitalDetailsUrl: `${TM_API}NCDCare/getBenVitalDetailsFrmNurseNCDCare`,
  mmuNurseWorklist: `${TM_API}common/getMmuNurseWorklistNew/`,

  /**
   * Covid-19 API Urls
   */
  saveNurseCovidDetails: `${TM_API}pandemic/covid/save/nurseData`,
  getCovidVisitDetails: `${TM_API}pandemic/covid/getBenVisitDetailsFrmNurseCovid`,
  saveDoctorCovidDetails: `${TM_API}pandemic/covid/save/doctorData`,
  updateCovidHistoryDetailsUrl: `${TM_API}pandemic/covid/update/historyScreen`,
  updateCovidVitalsDetailsUrl: `${TM_API}pandemic/covid/update/vitalScreen`,
  getCovidVisitDetailsUrl: ``,
  getCovidHistoryDetailsUrl: `${TM_API}pandemic/covid/getBenCovid19HistoryDetails`,
  getCovidVitalDetailsUrl: `${TM_API}pandemic/covid/getBenVitalDetailsFrmNurseCovid`,
  getCovidDoctorDetails: `${TM_API}pandemic/covid/getBenCaseRecordFromDoctorCovid`,
  updateCovidDoctorDetails: `${TM_API}pandemic/covid/update/doctorData`,

  /**
   * PNC Urls
   */
  savePNCNurseDetailsUrl: `${TM_API}PNC/save/nurseData`,
  savePNCDoctorDetailsUrl: `${TM_API}PNC/save/doctorData`,

  getPNCVisitDetailsUrl: `${TM_API}PNC/getBenVisitDetailsFrmNursePNC`,
  getPNCDetailsUrl: `${TM_API}PNC//getBenPNCDetailsFrmNursePNC`,
  getPNCVitalsDetailsUrl: `${TM_API}PNC/getBenVitalDetailsFrmNurse`,
  getPNCHistoryDetailsUrl: `${TM_API}PNC/getBenHistoryDetails`,
  getPNCExaminationDataUrl: `${TM_API}PNC/getBenExaminationDetailsPNC`,

  updatePNCDetailsUrl: `${TM_API}PNC/update/PNCScreen`,
  updatePNCHistoryDetailsUrl: `${TM_API}PNC/update/historyScreen`,
  updatePNCVitalsDetailsUrl: `${TM_API}PNC/update/vitalScreen`,
  updatePNCExaminationDetailsUrl: `${TM_API}PNC/update/examinationScreen`,


  /*
  */
  getPreviousSignificiantFindingUrl: `${TM_API}common/getDoctorPreviousSignificantFindings`,

  getCancerScreeningDoctorDetails: `${TM_API}CS-cancerScreening/getBenCaseRecordFromDoctorCS`,
  getNCDScreeningDoctorDetails: `${TM_API}NCD/getBenCaseRecordFromDoctorNCDScreening`,
  getGeneralOPDQuickConsultDoctorDetails: `${TM_API}genOPD-QC-quickConsult/getBenCaseRecordFromDoctorQuickConsult`,
  getANCDoctorDetails: `${TM_API}ANC/getBenCaseRecordFromDoctorANC`,
  getGeneralOPDDoctorDetails: `${TM_API}generalOPD/getBenCaseRecordFromDoctorGeneralOPD`,
  getNCDCareDoctorDetails: `${TM_API}NCDCare/getBenCaseRecordFromDoctorNCDCare`,
  getPNCDoctorDetails: `${TM_API}PNC/getBenCaseRecordFromDoctorPNC`,

  updateCancerScreeningDoctorDetails: `${TM_API}CS-cancerScreening/update/doctorData`,
  updateNCDScreeningDoctorDetails: `${TM_API}/NCD/update/doctorData`,
  updateGeneralOPDQuickConsultDoctorDetails: `${TM_API}genOPD-QC-quickConsult/update/doctorData`,
  updateANCDoctorDetails: `${TM_API}ANC/update/doctorData`,
  updateGeneralOPDDoctorDetails: `${TM_API}generalOPD/update/doctorData`,
  updateNCDCareDoctorDetails: `${TM_API}NCDCare/update/doctorData`,
  updatePNCDoctorDetails: `${TM_API}PNC/update/doctorData`,

  getTMCasesheetDataUrl: `${TM_API}common/get/Case-sheet/printData`,
  getMMUCasesheetDataUrl: `${MMU_API}common/get/Case-sheet/printData`,

  previousPastHistoryUrl: `${TM_API}common/getBenPastHistory`,
  previousMedicationHistoryUrl: `${TM_API}common/getBenMedicationHistory`,
  previousTobaccoHistoryUrl: `${TM_API}common/getBenTobaccoHistory`,
  previousAlcoholHistoryUrl: `${TM_API}common/getBenAlcoholHistory`,
  previousAllergyHistoryUrl: `${TM_API}common/getBenAllergyHistory`,
  previousFamilyHistoryUrl: `${TM_API}common/getBenFamilyHistory`,
  previousPastObstetricHistoryUrl: `${TM_API}common/getBenPastObstetricHistory`,
  previousMestrualHistoryUrl: `${TM_API}common/getBenMenstrualHistory`,
  previousComorbidityHistoryUrl: `${TM_API}common/getBenComorbidityConditionHistory`,
  previousImmunizationHistoryUrl: `${TM_API}common/getBenChildVaccineHistory`,
  previousOtherVaccineHistoryUrl: `${TM_API}common/getBenOptionalVaccineHistory`,
  previousPerinatalHistory: `${TM_API}common/getBenPerinatalHistory`,
  previousDevelopmentHistory: `${TM_API}common/getBenDevelopmentHistory`,
  previousFeedingHistory: `${TM_API}common/getBenFeedingHistory`,
  previousPhyscialactivityHistoryUrl : `${TM_API}common/getBenPhysicalHistory`,
  previousDiabetesHistoryUrl: `${TM_API}common/getBenPreviousDiabetesHistoryDetails`,
  previousReferredHistoryUrl: `${TM_API}common/getBenPreviousReferralHistoryDetails`,
  /* */
  archivedReportsUrl: `${TM_API}labTechnician/get/labResultForVisitcode`,
  ReportsBase64Url: `${TM_API}foetalMonitor/fetch/reportGraphBase64`,
  previousMMUHistoryUrl: `${MMU_API}common/getBeneficiaryCaseSheetHistory`,
  previousTMHistoryUrl: `${TM_API}common/getBeneficiaryCaseSheetHistory`,
  previousMCTSHistoryUrl: `${COMMON_API}mctsOutboundHistoryController/getMctsCallHistory`,
  previous104HistoryUrl: `${COMMON_API}beneficiary/get104BenMedHistory`,
  patientMCTSCallHistoryUrl: `${COMMON_API}mctsOutboundHistoryController/getMctsCallResponse`,
  drugDeleteUrl: `${TM_API}common/doctor/delete/prescribedMedicine`,
  newTaburl: `${mmuUICasesheet}`,

  getDataSYNCGroupUrl: `${TM_API}dataSyncActivity/getSyncGroupDetails`,
  syncDataUploadUrl: `${TM_API}dataSyncActivity/van-to-server`,
  syncDataDownloadUrl: `${TM_API}dataSyncActivity/startMasterDownload`,
  syncDownloadProgressUrl: `${TM_API}dataSyncActivity/checkMastersDownloadProgress`,
  getNcdScreeningVisitCountUrl: `${TM_API}NCD/getNcdScreeningVisitCount/`,
  getVanDetailsForMasterDownloadUrl: `${TM_API}dataSyncActivity/getVanDetailsForMasterDownload`,


  getMasterSpecializationUrl: `${SCHEDULER_API}/specialist/masterspecialization`,
  getSpecialistUrl: `${SCHEDULER_API}/specialist/getSpecialist`,
  getAvailableSlotUrl: `${SCHEDULER_API}/schedule/getavailableSlot`,
  getSwymedMailUrl: `${SCHEDULER_API}/van/getvan`,

  updateBeneficiaryArrivalStatusUrl: `${TM_API}tc/update/benArrivalStatus`,
  cancelBeneficiaryTCRequestUrl: `${TM_API}tc/cancel/benTCRequest`,
  scheduleTCUrl: `${TM_API}tc/create/benTCRequestWithVisitCode`,
  beneficiaryTCRequestStatusUrl: `${TM_API}tc/check/benTCRequestStatus`,
  swymedUrl: `${SWYMED_IP}`,
  saveSpecialistCancerObservationUrl: `${TM_API}CS-cancerScreening/update/doctorData`,
  getSwymedMailLoginUrl: `${TM_API}videoConsultation/login/`,
  invokeSwymedCallUrl: `${TM_API}videoConsultation/call/`,
  invokeSwymedCallSpecialistUrl: `${TM_API}videoConsultation/callvan/`,
  getSwymedLogoutUrl: `${TM_API}videoConsultation/logout`,
  updateTCStartTimeUrl: `${TM_API}tc/startconsultation`,
  snomedCTRecordListURL: `${TM_API}snomed/getSnomedCTRecordList`,
  getServiceOnStateUrl: `${COMMON_API}service/serviceList`,
  licenseUrl: `${COMMON_API}license.html`,
  apiVersionUrl: `${TM_API}version`,
  snomedCTRecordListURL1: `${COMMON_API}snomed/getSnomedCTRecordList`,
  
  ioturl: `${biologicalScreeningDeviceAPI}`,
  deviceStatusurl:`${biologicalScreeningDeviceAPI}/api/v1/bluetooth/hub/connection_status`,
  deviceDisconnectUrl:`${biologicalScreeningDeviceAPI}/api/v1/bluetooth/hub/disconnect`,
  deviceBluetoothurl:`${biologicalScreeningDeviceAPI}/api/v1/bluetooth/service_discovery`,
  connectdeviceBluetoothurl:`${biologicalScreeningDeviceAPI}/api/v1/bluetooth/hub_connection`,

  startWeighturl: "/api/v1/physical_tests/weight",
  startTempurl: "/api/v1/physical_tests/temperature",
  startPulseurl: "/api/v1/physical_tests/pulse_oxymetry",
  startBPurl: "/api/v1/physical_tests/blood_pressure",
  startHemoglobinurl: "/api/v1/wbpoct_tests/hemoglobin",
  startBloodGlucoseurl: "/api/v1/wbpoct_tests/blood_glucose",
  startRBSurl: '/api/v1/wbpoct_tests/blood_glucose',

 //file upload
  saveFile: `${COMMON_API}kmfilemanager/addFile`,
  viewFileData: `${TM_API}common/getKMFile`,

  /*Doctor signature download */
  downloadSignUrl: `${COMMON_API}signature1/`,
  getLanguageList:`${COMMON_API}beneficiary/getLanguageList`,
  
    /*Load MMU Provider Specific Data */
    loadMMUDataUrl:`${TM_API}common/getProviderSpecificData`,

      /*Load HRP Details */
   loadHRPUrl:`${TM_API}ANC/getHRPStatus`,
  healthIdGenerationUrl: `${FHIR_API}healthID/verifyOTPAndGenerateHealthID`,
  healthIdGenerationWithUIDUrl: `${FHIR_API}healthIDWithUID/createHealthIDWithUID`,
  gethealthIdDetailsUrl: `${FHIR_API}healthID/getBenhealthID`,
  mapHealthIdUrl: `${FHIR_API}healthID/mapHealthIDToBeneficiary`,
  otpGenerationUrl: `${FHIR_API}healthID/generateOTP`,
  otpGenerationWithUIDUrl: `${FHIR_API}healthIDWithUID/generateOTP`,
  verifyOTPUrl: `${FHIR_API}/healthIDWithUID/verifyOTP`,
  checkAndGenerateMobileOTPUrl: `${FHIR_API}healthIDWithUID/checkAndGenerateMobileOTP`,
  verifyMobileOTPUrl: `${FHIR_API}healthIDWithUID/verifyMobileOTP`,
  
   /*Health ID - care context Mapping*/
   careContextGenerateOtpUrl: `${FHIR_API}careContext/generateOTPForCareContext`,
   verifyOtpForMappingContextUrl:`${FHIR_API}careContext/validateOTPAndCreateCareContext`,
    /*Health ID Validation URL*/
  generateOTPForHealthIDValidation: `${FHIR_API}validate/generateOTPForHealthIDValidation`,
  verifyOTPForHealthIDValidation:`${FHIR_API}validate/verifyOTPForHealthIDValidation`,

  /* Health ID Card Generation*/
  generateOTPForHealthIDCard: `${FHIR_API}healthIDCard/generateOTP`,
  verifyOTPAndGenerateHealthCard:`${FHIR_API}healthIDCard/verifyOTPAndGenerateHealthCard`,

  /*Get Patient CBAC details*/
  getBenCBACDetails: `${COMMON_API}doortodoorapp/getSuspectedData_HRP_TB_NCD`,
  
  updateAmritIDInMongo: `${FHIR_API}higher/health/facility/update/bengenid`,
  
  /*Get patient higher health facility previous clinical records */
  higherHealthFacilityPreviousVisitDeatilsUrl: `${FHIR_API}higher/health/facility/get/clinical/data`,
   /*Calculate BMI for minors */
   calculateBmiStatus:  `${TM_API}common/calculateBMIStatus`,
  /* Validate users based on security questions */
  validateSecurityQuestions: `${COMMON_API}user/validateSecurityQuestionAndAnswer`,

  /* TransactionID for changing password */
  getTransacIDForPasswordChange: `${COMMON_API}user/getTransactionIdForChangePassword`,

      /*Covid vaccination Urls */
      vaccinationTypeAndDoseMasterUrl: `${COMMON_API}covid/master/VaccinationTypeAndDoseTaken`,
      saveCovidVaccinationDetailsUrl: `${COMMON_API}covid/saveCovidVaccinationDetails`,
      previousCovidVaccinationUrl: `${COMMON_API}covid/getCovidVaccinationDetails`,

    /* SWAASA Urls*/ 
    getResultStatusURL: `${COMMON_API}lungAssessment/startAssesment`,
    getAssessmentUrl: `${COMMON_API}lungAssessment/getAssesment`,
    getAssessmentIdUrl: `${COMMON_API}lungAssessment/getAssesmentDetails`,
    
    /*Biometric with Health ID*/ 
    getdeviceRDServiceUrl: `${COMMON_API}biometric/getBiometricData/`,
    confirmAadharBio:`${FHIR_API}healthIDWithBio/confirmWithAadhaarBio`,

    generateABHAForBio: `${FHIR_API}healthIDWithBio/verifyBio`,
    generateABHAForBioMobileOTP: `${FHIR_API}healthIDWithBio/generateMobileOTP`,
};
