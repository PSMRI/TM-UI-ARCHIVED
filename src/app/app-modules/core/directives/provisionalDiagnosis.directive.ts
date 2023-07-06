import { Directive, HostListener, Inject, Input, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MdDialog, MdDialogRef } from '@angular/material';

import { DiagnosisSearchComponent } from '../components/diagnosis-search/diagnosis-search.component';
import { QuickConsultUtils } from '../../nurse-doctor/shared/utility/quick-consult-utility';

@Directive({
    selector: '[appDiagnosisSearch]'
})
export class DiagnosisSearchDirective {

    @Input('previousSelected')
    addedDiagnosis: any;

    @Input('diagnosisListForm')
    diagnosisListForm: FormGroup;

    @HostListener('keyup.enter') onKeyDown() {
        this.openDialog();
    }

    @HostListener('click') onClick() {
        if (this.el.nativeElement.nodeName != "INPUT")
            this.openDialog();
    }
    utils = new QuickConsultUtils(this.fb);

    constructor(
        private fb: FormBuilder,
        private el: ElementRef,
        private dialog: MdDialog) { }

    openDialog(): void {
        let searchTerm = this.diagnosisListForm.value.viewProvisionalDiagnosisProvided;
        if (searchTerm.length > 2) {
            let dialogRef = this.dialog.open(DiagnosisSearchComponent, {
                width: '800px',
                // height: '500px',
                //panelClass: 'fit-screen',
                data: { searchTerm: searchTerm, addedDiagnosis: this.addedDiagnosis, diagonasisType: 'Provisional Diagnosis' }
            });

            dialogRef.afterClosed().subscribe(result => {
                console.log('result', result)
                if (result) {
                    let formArray = this.diagnosisListForm.parent as FormArray;
                    let len = formArray.length;
                    for (let i = len - 1, j = 0; i < len + result.length - 1; i++ , j++) {
                        (<FormGroup>formArray.at(i)).controls['term'].setValue(result[j].term);
                        (<FormGroup>formArray.at(i)).controls['conceptID'].setValue(result[j].conceptID);
                        (<FormGroup>formArray.at(i)).controls['viewProvisionalDiagnosisProvided'].setValue(result[j].term);
                        (<FormGroup>formArray.at(i)).controls['viewProvisionalDiagnosisProvided'].disable();
                        this.diagnosisListForm.markAsDirty();
                        if (formArray.length < len + result.length - 1)
                            formArray.push(this.utils.initProvisionalDiagnosisList());
                    }
                }

            });
        }
    }

}