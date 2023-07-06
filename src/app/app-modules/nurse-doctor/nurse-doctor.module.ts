import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { NurseDoctorRoutingModule } from './nurse-doctor-routing.module';
import { ChartsModule } from 'ng2-charts';

import { NurseWorklistComponent } from './nurse-worklist-wrapper/nurse-worklist/nurse-worklist.component';
import { DoctorWorklistComponent } from './doctor-worklist/doctor-worklist.component';
import { VisitDetailsComponent } from './visit-details/visit-details.component';
import { HistoryComponent } from './history/history.component';
import { ExaminationComponent } from './examination/examination.component';
import { VitalsComponent } from './vitals/vitals.component';
import { CaseRecordComponent } from './case-record/case-record.component';
import { QuickConsultComponent } from './quick-consult/quick-consult.component';
import { PncComponent } from './pnc/pnc.component';
import { NcdScreeningComponent } from './ncd-screening/ncd-screening.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { VisitDetailsComponent as VisitCategoryComponent } from './visit-details/visit-details/visit-details.component';
import { ChiefComplaintsComponent } from './visit-details/chief-complaints/chief-complaints.component';
import { AdherenceComponent } from './visit-details/adherence/adherence.component';
import {TravelHistoryComponent} from './visit-details/travel-history/travel-history.component';
import {SymptomsComponent} from './visit-details/symptoms/symptoms.component';
import {ContactHistoryComponent} from './visit-details/contact-history/contact-history.component';
import { InvestigationsComponent } from './visit-details/investigations/investigations.component';
import { UploadFilesComponent } from './visit-details/upload-files/upload-files.component';
import { AncComponent } from './anc/anc.component';
import { AncDetailsComponent } from './anc/anc-details/anc-details.component';
import { AncImmunizationComponent } from './anc/anc-immunization/anc-immunization.component';
import { ObstetricFormulaComponent } from './anc/obstetric-formula/obstetric-formula.component';

import { CancerHistoryComponent } from './history/cancer-history/cancer-history.component';
import { FamilyDiseaseHistoryComponent } from './history/cancer-history/family-disease-history/family-disease-history.component';
import { PersonalHistoryComponent } from './history/cancer-history/personal-history/personal-history.component';
import { ObstetricHistoryComponent } from './history/cancer-history/obstetric-history/obstetric-history.component';

import { GeneralOpdHistoryComponent } from './history/general-opd-history/general-opd-history.component';
import { PastHistoryComponent } from './history/general-opd-history/past-history/past-history.component';
import { GeneralPersonalHistoryComponent } from './history/general-opd-history/personal-history/personal-history.component';
import { ComorbidityConcurrentConditionsComponent } from './history/general-opd-history/comorbidity-concurrent-conditions/comorbidity-concurrent-conditions.component';
import { FamilyHistoryComponent } from './history/general-opd-history/family-history/family-history.component';
import { MenstrualHistoryComponent } from './history/general-opd-history/menstrual-history/menstrual-history.component';
import { PerinatalHistoryComponent } from './history/general-opd-history/perinatal-history/perinatal-history.component';
import { PastObstericHistoryComponent } from './history/general-opd-history/past-obsteric-history/past-obsteric-history.component';
import { ImmunizationHistoryComponent } from './history/general-opd-history/immunization-history/immunization-history.component';
import { OtherVaccinesComponent } from './history/general-opd-history/other-vaccines/other-vaccines.component';
import { FeedingHistoryComponent } from './history/general-opd-history/feeding-history/feeding-history.component';
import { DevelopmentHistoryComponent } from './history/general-opd-history/development-history/development-history.component';
import { MedicationHistoryComponent } from './history/general-opd-history/medication-history/medication-history.component';

import { CancerPatientVitalsComponent } from './vitals/cancer-patient-vitals/cancer-patient-vitals.component';
import { GeneralPatientVitalsComponent } from './vitals/general-patient-vitals/general-patient-vitals.component';

import { GeneralOpdExaminationComponent } from './examination/general-opd-examination/general-opd-examination.component';
import { GeneralExaminationComponent } from './examination/general-opd-examination/general-examination/general-examination.component';
import { HeadToToeExaminationComponent } from './examination/general-opd-examination/head-to-toe-examination/head-to-toe-examination.component';
import { SystemicExaminationComponent } from './examination/general-opd-examination/systemic-examination/systemic-examination.component';
import { CardioVascularSystemComponent } from './examination/general-opd-examination/systemic-examination/cardio-vascular-system/cardio-vascular-system.component';
import { GastroIntestinalSystemComponent } from './examination/general-opd-examination/systemic-examination/gastro-intestinal-system/gastro-intestinal-system.component';
import { RespiratorySystemComponent } from './examination/general-opd-examination/systemic-examination/respiratory-system/respiratory-system.component';
import { MusculoskeletalSystemComponent } from './examination/general-opd-examination/systemic-examination/musculoskeletal-system/musculoskeletal-system.component';
import { CentralNervousSystemComponent } from './examination/general-opd-examination/systemic-examination/central-nervous-system/central-nervous-system.component';
import { GenitoUrinarySystemComponent } from './examination/general-opd-examination/systemic-examination/genito-urinary-system/genito-urinary-system.component';
import { ObstetricExaminationComponent } from './examination/general-opd-examination/systemic-examination/obstetric-examination/obstetric-examination.component';

import { CancerExaminationComponent } from './examination/cancer-examination/cancer-examination.component';
import { SignsAndSymptomsComponent } from './examination/cancer-examination/signs-and-symptoms/signs-and-symptoms.component';
import { OralExaminationComponent } from './examination/cancer-examination/oral-examination/oral-examination.component';
import { BreastExaminationComponent } from './examination/cancer-examination/breast-examination/breast-examination.component';
import { AbdominalExaminationComponent } from './examination/cancer-examination/abdominal-examination/abdominal-examination.component';
import { GynecologicalExaminationComponent } from './examination/cancer-examination/gynecological-examination/gynecological-examination.component';

import { CancerCaseRecordComponent } from './case-record/cancer-case-record/cancer-case-record.component';
import { GeneralCaseRecordComponent } from './case-record/general-case-record/general-case-record.component';

import { CancerReferComponent } from './refer/cancer-refer/cancer-refer.component';
import { GeneralReferComponent } from './refer/general-refer/general-refer.component';

import { CancerCaseSheetComponent } from './case-sheet/cancer-case-sheet/cancer-case-sheet.component';
import { GeneralCaseSheetComponent } from './case-sheet/general-case-sheet/general-case-sheet.component';

import { NurseService, DoctorService, MasterdataService } from './shared/services';
import { WorkareaComponent } from './workarea/workarea.component';
import { ReferComponent } from './refer/refer.component';

import { PrintPageSelectComponent } from './print-page-select/print-page-select.component';
import { PreviousVisitDetailsComponent } from './case-record/general-case-record/previous-visit-details/previous-visit-details.component';
import { FindingsComponent } from './case-record/general-case-record/findings/findings.component';
import { DiagnosisComponent } from './case-record/general-case-record/diagnosis/diagnosis.component';
import { PrescriptionComponent } from './case-record/general-case-record/prescription/prescription.component';
import { DoctorInvestigationsComponent } from './case-record/general-case-record/doctor-investigations/doctor-investigations.component';
import { TestAndRadiologyComponent } from './case-record/general-case-record/test-and-radiology/test-and-radiology.component';
import { RadiologistWorklistComponent } from './radiologist-worklist/radiologist-worklist.component';
import { OncologistWorklistComponent } from './oncologist-worklist/oncologist-worklist.component';
import { GeneralOpdDiagnosisComponent } from './case-record/general-case-record/diagnosis/general-opd-diagnosis/general-opd-diagnosis.component';
import { AncDiagnosisComponent } from './case-record/general-case-record/diagnosis/anc-diagnosis/anc-diagnosis.component';
import { CaseSheetComponent } from './case-sheet/case-sheet.component';
import { NcdCareDiagnosisComponent } from './case-record/general-case-record/diagnosis/ncd-care-diagnosis/ncd-care-diagnosis.component';
import { PncDiagnosisComponent } from './case-record/general-case-record/diagnosis/pnc-diagnosis/pnc-diagnosis.component';
import { PreviousSignificiantFindingsComponent } from './case-record/general-case-record/previous-significiant-findings/previous-significiant-findings.component';
import { ViewTestReportComponent } from './case-record/general-case-record/test-and-radiology/view-test-report/view-test-report.component';
import { HistoryCaseSheetComponent } from './case-sheet/general-case-sheet/history-case-sheet/history-case-sheet.component';
import { ExaminationCaseSheetComponent } from './case-sheet/general-case-sheet/examination-case-sheet/examination-case-sheet.component';
import { AncCaseSheetComponent } from './case-sheet/general-case-sheet/anc-case-sheet/anc-case-sheet.component';
import { PncCaseSheetComponent } from './case-sheet/general-case-sheet/pnc-case-sheet/pnc-case-sheet.component';
import { DoctorDiagnosisCaseSheetComponent } from './case-sheet/general-case-sheet/doctor-diagnosis-case-sheet/doctor-diagnosis-case-sheet.component';
import { ImageToCanvasComponent } from './case-sheet/cancer-case-sheet/image-to-canvas/image-to-canvas.component';
import { CancerDoctorDiagnosisCaseSheetComponent } from './case-sheet/cancer-case-sheet/cancer-doctor-diagnosis-case-sheet/cancer-doctor-diagnosis-case-sheet.component';
import { CancerHistoryCaseSheetComponent } from './case-sheet/cancer-case-sheet/cancer-history-case-sheet/cancer-history-case-sheet.component';
import { CancerExaminationCaseSheetComponent } from './case-sheet/cancer-case-sheet/cancer-examination-case-sheet/cancer-examination-case-sheet.component';
import { BeneficiaryMctsCallHistoryComponent } from './case-record/beneficiary-mcts-call-history/beneficiary-mcts-call-history.component';
import { BeneficiaryPlatformHistoryComponent } from './case-record/beneficiary-platform-history/beneficiary-platform-history.component';

import { WorkareaCanActivate } from './workarea/workarea-can-activate.service';
import { TcSpecialistWorklistComponent } from './tc-specialist-worklist/tc-specialist-worklist.component';
import { DoctorTmWorklistWrapperComponent } from './doctor-tm-worklist-wrapper/doctor-tm-worklist-wrapper.component';
import { TmFutureWorklistComponent } from './doctor-tm-future-worklist/tm-future-worklist.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { TcSpecialistWorklistWrapperComponent } from './tc-specialist-worklist-wrapper/tc-specialist-worklist-wrapper.component';
import { TcSpecialistFutureWorklistComponent } from './tc-specialist-future-worklist/tc-specialist-future-worklist.component';
import { NurseWorklistWrapperComponent } from './nurse-worklist-wrapper/nurse-worklist-wrapper.component';
import { NurseTmWorklistComponent } from './nurse-worklist-wrapper/nurse-tm-worklist/nurse-tm-worklist.component';
import { NurseTmFutureWorklistComponent } from './nurse-worklist-wrapper/nurse-tm-future-worklist/nurse-tm-future-worklist.component';
import { LabService } from '../../app-modules/lab/shared/services';
import { CovidDiagnosisComponent } from './case-record/general-case-record/diagnosis/covid-diagnosis/covid-diagnosis.component';
import { IdrsComponent } from './idrs/idrs.component';
import { IdrsscoreService } from './shared/services/idrsscore.service';
import { PhysicalActivityHistoryComponent } from './history/general-opd-history/physical-activity-history/physical-activity-history.component';
import { FamilyHistoryNcdscreeningComponent } from './history/general-opd-history/family-history-ncdscreening/family-history-ncdscreening.component';
import { NcdScreeningDiagnosisComponent } from './case-record/general-case-record/diagnosis/ncd-screening-diagnosis/ncd-screening-diagnosis.component';
import { NurseMmuTmReferredWorklistComponent } from './nurse-worklist-wrapper/nurse-mmu-tm-referred-worklist/nurse-mmu-tm-referred-worklist.component';
import { DiseaseconfirmationComponent } from './visit-details/diseaseconfirmation/diseaseconfirmation.component';
import { RegistrarService} from '../registrar/shared/services/registrar.service';
import { TestInVitalsService } from './shared/services/test-in-vitals.service';
import { CovidVaccinationStatusComponent } from './visit-details/covid-vaccination-status/covid-vaccination-status.component';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    NurseDoctorRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    NurseWorklistComponent,
    PrintPageSelectComponent,
    QuickConsultComponent,
    CancerExaminationComponent,
    GynecologicalExaminationComponent,
    AbdominalExaminationComponent,
    BreastExaminationComponent,
    OralExaminationComponent,
    SignsAndSymptomsComponent,
    ObstetricExaminationComponent,
    GenitoUrinarySystemComponent,
    CentralNervousSystemComponent,
    MusculoskeletalSystemComponent,
    RespiratorySystemComponent,
    GastroIntestinalSystemComponent,
    CardioVascularSystemComponent,
    SystemicExaminationComponent,
    HeadToToeExaminationComponent,
    GeneralExaminationComponent,
    GeneralOpdExaminationComponent,
    CancerPatientVitalsComponent,
    GeneralPatientVitalsComponent,
    MedicationHistoryComponent,
    DevelopmentHistoryComponent,
    FeedingHistoryComponent,
    OtherVaccinesComponent,
    ImmunizationHistoryComponent,
    PastObstericHistoryComponent,
    PerinatalHistoryComponent,
    MenstrualHistoryComponent,
    FamilyHistoryComponent,
    ComorbidityConcurrentConditionsComponent,
    GeneralPersonalHistoryComponent,
    PastHistoryComponent,
    GeneralOpdHistoryComponent,
    CancerHistoryComponent,
    ObstetricHistoryComponent,
    FamilyDiseaseHistoryComponent,
    PersonalHistoryComponent,
    DoctorWorklistComponent,
    AncComponent,
    AncDetailsComponent,
    AncImmunizationComponent,
    ObstetricFormulaComponent,
    VisitDetailsComponent,
    VisitCategoryComponent,
    ChiefComplaintsComponent,
    AdherenceComponent,
    TravelHistoryComponent,
    SymptomsComponent,
    ContactHistoryComponent,
    InvestigationsComponent,
    UploadFilesComponent,
    HistoryComponent,
    ExaminationComponent,
    VitalsComponent,
    CaseRecordComponent,
    AncComponent,
    PncComponent,
    NcdScreeningComponent,
    DashboardComponent,
    WorkareaComponent,
    CancerCaseRecordComponent,
    GeneralCaseRecordComponent,
    CancerReferComponent,
    GeneralReferComponent,
    CancerCaseSheetComponent,
    GeneralCaseSheetComponent,
    ReferComponent,
    PrintPageSelectComponent,
    PreviousVisitDetailsComponent,
    FindingsComponent,
    DiagnosisComponent,
    PrescriptionComponent,
    DoctorInvestigationsComponent,
    TestAndRadiologyComponent,
    RadiologistWorklistComponent,
    OncologistWorklistComponent,
    GeneralOpdDiagnosisComponent,
    AncDiagnosisComponent,
    CaseSheetComponent,
    NcdCareDiagnosisComponent,
    PncDiagnosisComponent,
    PreviousSignificiantFindingsComponent,
    ViewTestReportComponent,
    HistoryCaseSheetComponent,
    ExaminationCaseSheetComponent,
    AncCaseSheetComponent,
    PncCaseSheetComponent,
    DoctorDiagnosisCaseSheetComponent,
    ImageToCanvasComponent,
    CancerDoctorDiagnosisCaseSheetComponent,
    CancerHistoryCaseSheetComponent,
    CancerExaminationCaseSheetComponent,
    BeneficiaryMctsCallHistoryComponent,
    BeneficiaryPlatformHistoryComponent,
    TcSpecialistWorklistComponent,
    DoctorTmWorklistWrapperComponent,
    TmFutureWorklistComponent,
    SchedulerComponent,
    TcSpecialistWorklistWrapperComponent,
    TcSpecialistFutureWorklistComponent,
    NurseWorklistWrapperComponent,
    NurseTmWorklistComponent,
    NurseTmFutureWorklistComponent,
    CovidDiagnosisComponent,
    IdrsComponent,
    PhysicalActivityHistoryComponent,
    FamilyHistoryNcdscreeningComponent,
    NcdScreeningDiagnosisComponent,
    NurseMmuTmReferredWorklistComponent,
    DiseaseconfirmationComponent,
    CovidVaccinationStatusComponent,
  ],


  providers: [NurseService, DoctorService, MasterdataService, WorkareaCanActivate, LabService,IdrsscoreService,RegistrarService,TestInVitalsService],
  entryComponents: [PrintPageSelectComponent, ViewTestReportComponent, BeneficiaryMctsCallHistoryComponent, SchedulerComponent]
})
export class NurseDoctorModule { }
