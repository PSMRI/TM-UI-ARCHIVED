import { FormBuilder, FormGroup, Validators, FormArray, } from '@angular/forms';

export class NCDScreeningUtils {
    constructor(private fb: FormBuilder) { }

    createNCDScreeningForm() {
        return this.fb.group({
            ncdScreeningConditionList:null,
            reasonForScreening: null,
            ncdScreeningVisitNo: null,
            labTestOrders: [],
            weight_Kg: null,
            height_cm: null,
            waistCircumference_cm: null,
            hipCircumference_cm: null,
            bMI: null,
            waistHipRatio: null,
            systolicBP_1stReading: null,
            diastolicBP_1stReading: null,
            systolicBP_2ndReading: null,
            diastolicBP_2ndReading: null,
            systolicBP_3rdReading: null,
            diastolicBP_3rdReading: null,
            averageSystolicBP_Reading: null,
            averageDiastolicBP_Reading: null,
            bloodGlucose_Fasting: null,
            bloodGlucose_Random: null,
            bloodGlucose_2hr_PP: null,
            bloodGlucose_NotSpecified: null,
            bloodPressureStatus: null,
            diabeticStatus: null,
            nextScreeningDate: null,
            isScreeningComplete: null,
            isBPPrescribed: null,
            isBloodGlucosePrescribed: null,
            vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
            parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
        })
    }
    createIDRSForm() {
        return this.fb.group({
            beneficiaryRegID: null,
            providerServiceMapID: null,
            createdBy: null,
            idrsScore:null,
            questionArray:null,
            suspectArray:null,
            confirmArray:null,
            deleted:false,
            requiredList:null,
            isDiabetic:null,
            vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
            parkingPlaceID: JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
        })
    }
}