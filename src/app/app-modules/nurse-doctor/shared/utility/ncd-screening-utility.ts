/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
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