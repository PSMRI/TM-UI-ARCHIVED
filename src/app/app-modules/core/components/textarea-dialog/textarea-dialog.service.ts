import { Injectable } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { TextareaDialogComponent } from './textarea-dialog.component';

import { Observable} from 'rxjs/Observable';
@Injectable()
export class TextareaDialog {

    constructor(public dialog: MdDialog) { }

    open(observations: string, length = 500): Observable<any> {
        let dialogRef = this.dialog.open(TextareaDialogComponent, {
            width: '500px',
            data: { 'observations': observations, 'length': length }
        });
        return dialogRef.afterClosed();
    }

}
