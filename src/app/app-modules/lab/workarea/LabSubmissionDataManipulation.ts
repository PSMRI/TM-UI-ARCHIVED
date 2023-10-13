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


export class DataManipulation {
    technicalDataRestruct(techForm) {
        let labForm;
        let radiologyForm;
        if (techForm.labForm) {
        labForm = this.laboratoryDataRestruct(techForm.labForm);
        }
        return {
            labTestResults: labForm,
            radiologyTestResults: radiologyForm
        };
    }

    laboratoryDataRestruct(labForm) {
        const labTestResults = [];
        labForm.forEach((element, i) => {
            if (element.prescriptionID && element.procedureID) {
                labTestResults.push({
                    prescriptionID: element.prescriptionID,
                    procedureID: element.procedureID,
                    compList: this.labComponentRestruct(element.compListDetails)
                })

            }
        })

        const finalLabObject = labTestResults.filter((item) => {
            return item.compList.length !== 0
        })

        return finalLabObject
    }

    labComponentRestruct(compList) {
        const comps = [];
        compList.forEach((element, i) => {
            if(element.stripsNotavailable){
                if (element.testComponentID) {
                    comps.push({
                        testComponentID: element.testComponentID,
                        testResultValue: element.inputValue || element.compOptSelected,
                        testResultUnit: element.measurementUnit || undefined,
                        remarks: element.remarks || undefined,
                        stripsNotAvailable:element.stripsNotavailable
                    })
                }
            }
            else{
                if ((element.testComponentID && element.inputValue)
                || (element.testComponentID && element.compOptSelected)) {
                    comps.push({
                        testComponentID: element.testComponentID,
                        testResultValue: element.inputValue || element.compOptSelected,
                        testResultUnit: element.measurementUnit || undefined,
                        remarks: element.remarks || undefined
                    })
                }
            }
        });
        return comps;

    }

}
