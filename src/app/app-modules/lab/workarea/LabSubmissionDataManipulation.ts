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
