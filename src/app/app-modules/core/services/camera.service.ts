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


import { Observable } from 'rxjs/Rx';
import { CameraDialogComponent } from '../components/camera-dialog/camera-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class CameraService {

    constructor(private dialog: MdDialog, @Inject(DOCUMENT) doc: any) {
    }


    public capture(titleAlign: string = 'center'): Observable<any> {

        let dialogRef: MdDialogRef<CameraDialogComponent>;
        const config = new MdDialogConfig();
        dialogRef = this.dialog.open(CameraDialogComponent, config);
        dialogRef.componentInstance.capture = true;
        dialogRef.componentInstance.imageCode = false;
        return dialogRef.afterClosed();

    }

    public viewImage(benImageCode: string, titleAlign: string = 'center'): void {

        let dialogRef: MdDialogRef<CameraDialogComponent>;
        const config = new MdDialogConfig();
        dialogRef = this.dialog.open(CameraDialogComponent, config);
        dialogRef.componentInstance.capture = false;
        dialogRef.componentInstance.imageCode = benImageCode;

    }

    public annotate(image: string, points, titleAlign: string = 'center'): Observable<any> {

        let dialogRef: MdDialogRef<CameraDialogComponent>;
        const config = new MdDialogConfig();
        dialogRef = this.dialog.open(CameraDialogComponent, {
            width: '80%'
        });
        dialogRef.componentInstance.capture = false;
        dialogRef.componentInstance.imageCode = false;
        dialogRef.componentInstance.annotate = image;
        dialogRef.componentInstance.availablePoints = points;
        return dialogRef.afterClosed();

    }

    public ViewGraph(graph): void {
        let dialogRef: MdDialogRef<CameraDialogComponent>;
        const config = new MdDialogConfig();
        dialogRef = this.dialog.open(CameraDialogComponent, {
            width: '80%',
        });
        dialogRef.componentInstance.capture = false;
        dialogRef.componentInstance.imageCode = false;
        dialogRef.componentInstance.annotate = false;
        dialogRef.componentInstance.availablePoints = false;
        dialogRef.componentInstance.graph = graph;
    }
    public close(): void {
    }

}
