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


import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ConfirmationService } from '../../services/confirmation.service';
import { MatDialogModule } from '@angular/material';
import * as html2canvas from 'html2canvas';
import { saveAs } from 'file-saver/FileSaver';
import { HttpServiceService } from '../../services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

interface mark {
  xCord: any;
  yCord: any;
  description: any;
  point: any;
}

@Component({
  selector: 'app-camera-dialog',
  templateUrl: './camera-dialog.component.html',
  styleUrls: ['./camera-dialog.component.css']
})

export class CameraDialogComponent implements OnInit {

  @Output() cancelEvent = new EventEmitter();

  @ViewChild('myCanvas') myCanvas;
  @ViewChild('myImg') myImg;

  status: any;
  public imageCode: any;
  public availablePoints: any;
  public annotate: any;
  public title: string;
  public capture: boolean;
  public captured: any = false;
  public webcam: any;
  public graph: any;
  base64: any;
  error: any;
  options: any;
  canvas: any;
  pointsToWrite: Array<any> = [];
  markers: mark[] = [];
  ctx: CanvasRenderingContext2D;
  loaded: Boolean;
  currentLanguageSet: any;

  //   checkValues: mark[] = [{
  //     "xCord": 120,
  //     "yCord": 53,
  //     "description": "qqqa",
  //     "point": 1
  // },
  // {
  //     "xCord": 271,
  //     "yCord": 62,
  //     "description": "aaa",
  //     "point": 2
  // },
  // {
  //     "xCord": 101,
  //     "yCord": 159,
  //     "description": "zzzz",
  //     "point": 3
  // },
  // {
  //     "xCord": 247,
  //     "yCord": 243,
  //     "description": "dddd",
  //     "point": 4
  // },
  // {
  //     "xCord": 111,
  //     "yCord": 292,
  //     "description": "gggg",
  //     "point": 5
  // }]

  constructor(
    public dialogRef: MdDialogRef<CameraDialogComponent>,
    private element: ElementRef,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService) {
    this.options = {
      audio: false,
      video: true,
      //fallback: true,//force flash
      width: 500,
      height: 390,
      fallbackMode: 'callback',
      fallbackSrc: 'jscam_canvas_only.swf',
      fallbackQuality: 50,
      cameraType: 'back'
    };
  }

  onSuccess(stream: any) {
    console.log('capturing video stream');
  };

  onError(err) {
    console.log(err);
  };

  captureBase64() {
    if (!this.captured) {

      this.status = this.currentLanguageSet.retry;
      return this.webcam.getBase64()
        .then(base => {
          this.captured = new Date()
          this.base64 = base
          setTimeout(() => this.webcam.resizeVideo(), 0)
        })
        .catch(e => console.error(e))
    } else {
      this.captured = false;
      this.status = this.currentLanguageSet.capture;

    }
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.loaded = false;
    this.status = this.currentLanguageSet.capture;
    //this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    //console.log(this.availablePoints );
    if (this.availablePoints && this.availablePoints.markers) this.pointsToWrite = this.availablePoints.markers;

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  Confirm() {
    this.cancelEvent.emit(null);
  }

  ngAfterViewInit() {
    if (this.annotate) this.loadingCanvas();

    if (!this.loaded) {
      if (this.annotate) this.loadingCanvas();
      this.loaded = true;
    }
    // this.checkValues.forEach((value)=> {
    //   this.pointMark(value);
    // })
    if (this.pointsToWrite) this.loadMarks();

  }

  loadMarks() {
    //console.log(this.availablePoints, 'points');
    this.pointsToWrite.forEach((num) => {
      this.pointMark(num);
    })
  }

  loadingCanvas() {
    this.canvas = this.myCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    let img = this.myImg.nativeElement;
    // console.log(img, 'img')
    this.ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = 'bold 20px serif';
    this.score = 1;
  }

  score: any;
  pointMark(event) {
    if (event.xCord) event.offsetX = event.xCord;
    if (event.yCord) event.offsetY = event.yCord;
    if (this.score <= 6) {
      this.ctx.strokeRect(event.offsetX - 10, event.offsetY - 10, 20, 20);
      this.ctx.fillText(this.score, event.offsetX - 3, event.offsetY + 6);
      this.saveDescription(event);
    } else {
      setTimeout(() => {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.sixMakers);
      }, 0);
    }
    // } else {
    //     this.ctx.strokeRect(event.offsetX-10, event.offsetY-10, 30, 20);
    //     this.ctx.fillText(this.score, event.offsetX-5, event.offsetY+6);
    // }
  }


  clearPointers() {
    this.markers.splice(0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.loadingCanvas();
    // console.log(this.markers);
  }

  saveDescription(event) {
    if (event.description) {
      this.markers.push({
        xCord: event.offsetX,
        yCord: event.offsetY,
        description: event.description,
        point: event.point,
      })
    } else {
      this.markers.push({
        xCord: event.offsetX,
        yCord: event.offsetY,
        description: "",
        point: this.score,
      })
    }
    this.score++;

  }


  getMarkers() {
    return {
      beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
      visitID: localStorage.getItem('visitID'),
      createdBy:localStorage.getItem('userName'),
      imageID: '',
      providerServiceMapID: localStorage.getItem('providerServiceID'),
      markers: this.markers
    }
  }


  downloadGraph() {
    html2canvas(document.getElementById('container-dialog')).then((canvas) => {
     canvas.toBlob((blob) => {
       try {
         const graphName = `${this.graph.type}_${localStorage.getItem('beneficiaryRegID')}_${localStorage.getItem('visitID')}`
         || 'graphTrends';
        saveAs(blob, graphName);
       } catch (e) {
        window.open().document.write('<img src="' + canvas.toDataURL() + '" />');
       }
     })
    });

  }



}


