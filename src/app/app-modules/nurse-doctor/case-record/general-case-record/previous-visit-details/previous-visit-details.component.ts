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


import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DoctorService } from '../../../shared/services';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { CameraService } from '../../../../core/services/camera.service';
import { environment } from 'environments/environment';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
@Component({
  selector: 'app-previous-visit-details',
  templateUrl: './previous-visit-details.component.html',
  styleUrls: ['./previous-visit-details.component.css']
})
export class PreviousVisitDetailsComponent implements OnInit, OnChanges {

  lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Weight Graph
  weightChartData = [];
  weightChartLabels = [];

  weightChartColors: Array<any> = [
    { // maroon
      backgroundColor: 'rgba(128,0,0,0.2)',
      borderColor: 'maroon',
      pointBackgroundColor: 'maroon',
      pointBorderColor: 'maroon',
      pointHoverBackgroundColor: 'maroon',
      pointHoverBorderColor: 'maroon'
    }
  ];
  weightChartLegend: boolean = true;
  weightChartType: string = 'line';
  // Ends Weight Graph

  // Bp Graph
  bpChartData = [];
  bpChartLabels = [];
  bpChartColors: Array<any> = [
    {
      // blueish
      backgroundColor: 'rgba(0,140,255,0.2)',
      borderColor: 'rgba(0,10,255,0.7)',
      pointBackgroundColor: 'rgba(0,10,255,0.7)',
      pointBorderColor: 'rgba(0,10,255,0.7)',
      pointHoverBackgroundColor: 'rgba(0,10,255,0.7)',
      pointHoverBorderColor: 'rgba(0,10,255,0.7)'
    }, {
      //pinkish
      backgroundColor: 'rgba(222,92,132,0.2)',
      borderColor: 'rgba(222,92,132,1)',
      pointBackgroundColor: 'rgba(222,92,132,1)',
      pointBorderColor: 'rgba(222,92,132,1)',
      pointHoverBackgroundColor: 'rgba(222,92,132,1)',
      pointHoverBorderColor: 'rgba(222,92,132,1)'
    }
  ]
  bpChartLegend: boolean = true;
  bpChartType: string = 'line';
  // Ends Bp Graph


  // Bg Chart
  bgChartData = [];
  bgChartLabels = [];
  bgChartColors = [{
    // blueish
    // blueish
    backgroundColor: 'rgba(0,140,255,0.2)',
    borderColor: 'rgba(0,10,255,0.7)',
    pointBackgroundColor: 'rgba(0,10,255,0.7)',
    pointBorderColor: 'rgba(0,10,255,0.7)',
    pointHoverBackgroundColor: 'rgba(0,10,255,0.7)',
    pointHoverBorderColor: 'rgba(0,10,255,0.7)'
  }, {
    // grenish
    backgroundColor: 'rgba(125,200,94,0.2)',
    borderColor: 'rgba(125,200,94,0.7)',
    pointBackgroundColor: 'rgba(125,200,94,0.7)',
    pointBorderColor: 'rgba(125,200,94,0.7)',
    pointHoverBackgroundColor: 'rgba(125,200,94,0.7)',
    pointHoverBorderColor: 'rgba(125,200,94,0.7)',
  }, {
    // pinkish
    backgroundColor: 'rgba(222,92,132,0.2)',
    borderColor: 'rgba(222,92,132,1)',
    pointBackgroundColor: 'rgba(222,92,132,1)',
    pointBorderColor: 'rgba(222,92,132,1)',
    pointHoverBackgroundColor: 'rgba(222,92,132,1)',
    pointHoverBorderColor: 'rgba(222,92,132,1)'
  }];
  bgChartLegend: boolean = true;
  bgChartType: string = 'line';

  //Ends Bg Chart


  @Input('currentVitals')
  vitals: any;

  previousVisitDetails: any;
  current_language_set: any;
  constructor(private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private cameraService: CameraService,
    private router: Router,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    // this.getPreviousVisitDetails();
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response => this.current_language_set = response);
    this.loadGraphData();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges() {
    console.log("current vitals", this.vitals);
  }

  loadGraphData() {
    const benRegID = localStorage.getItem('beneficiaryRegID')
    const visitID = localStorage.getItem('visitID')
    const visitCategory = localStorage.getItem('visitCategory')

    this.doctorService.getCaseRecordAndReferDetails(benRegID, visitID, visitCategory)
      .subscribe((data) => {
        console.log(data, 'data here', data.GraphData, 'graphdata')
        if (data && data.data && data.data.GraphData) {
          this.plotGraphs(data.data.GraphData)
        }
      })

  }

  plotGraphs(graphsData) {
    this.plotBloodPressureGraph(graphsData.bpList);
    this.plotWeightGraph(graphsData.weightList);
    this.plotBloodSugarGraph(graphsData.bgList);
  }

  plotBloodPressureGraph(bpList) {
    const systolic = [];
    const diastolic = [];

    console.log(bpList, 'bpList');
    if (bpList && bpList.length) {
      bpList = bpList.reverse();
      const k = Object.assign([], bpList);
      k.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return +new Date(b.date) - +new Date(a.date);
      });
      console.log(k, 'dated')
      k.forEach(element => {
        if (element.date && element.avgDysBP && element.avgSysBP) {
          systolic.push(element.avgSysBP);
          diastolic.push(element.avgDysBP);
          this.bpChartLabels.push(element.date);
        }
      });
    }
    if (systolic.length && diastolic.length) {
      this.bpChartData.push({ data: systolic, label: 'Systolic BP' });
      this.bpChartData.push({ data: diastolic, label: 'Diastolic BP' });
    }
  };

  plotWeightGraph(weightList) {
    console.log(weightList, 'weightListCall');
    const data = [];
    const k = Object.assign([], weightList);
    k.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return +new Date(b.date) - +new Date(a.date);
    });
    console.log(k, 'dated')
    if (k && k.length) {
      // weightList = weightList.reverse();
      k.forEach(element => {
        if (element.date && element.weight) {
          data.push(element.weight);
          this.weightChartLabels.push(element.date);
        }
      });
      this.weightChartData.push({ data: data, label: 'Weight' })
    }
  };


  plotBloodSugarGraph(bgList) {
    console.log(bgList, 'bgList....');
    const postPrandial = [];
    const fasting = [];
    const random = [];
    const k = Object.assign([], bgList);
    k.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return +new Date(b.date) - +new Date(a.date);
    });
    console.log(k, 'dated')
    if (k && k.length) {
      // k = k.reverse();
      k.forEach(element => {
        if (element.date && element.bg_2hr_pp && element.bg_fasting && element.bg_random) {
          postPrandial.push(element.bg_2hr_pp);
          fasting.push(element.bg_fasting);
          random.push(element.bg_random);
          this.bgChartLabels.push(element.date);
        }
      });
      this.bgChartData.push({ data: postPrandial, label: '2-Hr Post Prandial' })
      this.bgChartData.push({ data: fasting, label: 'Fasting' })
      this.bgChartData.push({ data: random, label: 'Random' })
    }
  };

  // getPreviousVisitDetails() {
  //   const benRegID = localStorage.getItem('beneficiaryRegID');
  //   this.doctorService.getPreviousVisitDetails(benRegID)
  //     .subscribe((data) => {
  //       if (data && data.benVisitDetails && data.benVisitDetails.length > 0)
  //         this.previousVisitDetails = data.benVisitDetails.slice(0, 5);
  //       console.log("previous visit Details", this.previousVisitDetails);
  //     });
  // }

  calculateBMI() {
    if (this.vitals)
      return +((this.vitals.weight_Kg / (this.vitals.height_cm * this.vitals.height_cm)) * 10000).toFixed(1);
  }

  visitDateTime: any;
  getCaseSheetPrintData(visitDetail) {
    let visitDateAndTime: Date;
    visitDateAndTime = visitDetail.createdDate;
    this.visitDateTime = new Date(visitDateAndTime).toISOString();

    // if (visitDetail.visitCategory == 'Cancer Screening') {
    //   window.open(environment.printCancerCase_sheet_url + '/#/common/casesheet/' + visitDetail.beneficiaryRegID + '/' + visitDetail.benVisitID + '/' + this.visitDateTime);
    // } else {
    //   console.log('visitDetail', visitDetail);

      localStorage.setItem('caseSheetBenFlowID', null);
      localStorage.setItem('caseSheetVisitCategory', visitDetail.visitCategory);
      localStorage.setItem('caseSheetBeneficiaryRegID', visitDetail.beneficiaryRegID);
      localStorage.setItem('caseSheetVisitID', visitDetail.benVisitID);
      this.router.navigate(['/common/print']);
    // }
  }


  chartClicked(type) {
    let graphObject = {};
    switch (type) {
      case 'bw':
        graphObject = {
          type: type,
          lineChartOptions: this.lineChartOptions || undefined,
          chartData: this.weightChartData || undefined,
          chartLabels: this.weightChartLabels || undefined,
          chartColors: this.weightChartColors || undefined,
          chartLegend: this.weightChartLegend || undefined,
          chartType: this.weightChartType || undefined
        }
        this.callBodyWeightGraph(graphObject);
        break;
      case 'bp':
        graphObject = {
          type: type,
          lineChartOptions: this.lineChartOptions || undefined,
          chartData: this.bpChartData || undefined,
          chartLabels: this.bpChartLabels || undefined,
          chartColors: this.bpChartColors || undefined,
          chartLegend: this.bpChartLegend || undefined,
          chartType: this.bpChartType || undefined
        }
        this.callBloodPressureGraph(graphObject);
        break;
      case 'bg':
        graphObject = {
          type: type,
          lineChartOptions: this.lineChartOptions || undefined,
          chartData: this.bgChartData || undefined,
          chartLabels: this.bgChartLabels || undefined,
          chartColors: this.bgChartColors || undefined,
          chartLegend: this.bgChartLegend || undefined,
          chartType: this.bgChartType || undefined
        }
        this.callBloodGlucoseGraph(graphObject);
        break;
      default:
        console.log('type', type);
        break;
    }
  }

  callBodyWeightGraph(graphData) {
    if (Object.keys(graphData).length === 7) {
      this.cameraService.ViewGraph(graphData)

    }

  }
  callBloodPressureGraph(graphData) {
    if (Object.keys(graphData).length === 7) {
      this.cameraService.ViewGraph(graphData)

    }

  }
  callBloodGlucoseGraph(graphData) {
    if (Object.keys(graphData).length === 7) {
      this.cameraService.ViewGraph(graphData)

    }
  }

}

