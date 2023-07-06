import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from '../app-modules/core/services/confirmation.service';
import { TelemedicineService } from '../app-modules/core/services/telemedicine.service';
import { ServicePointService } from './../service-point/service-point.service';
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  servicesList: any;
  serviceIDs: any;
  fullName: any;

  constructor(
    private router: Router,
    private telemedicineService: TelemedicineService,
    private servicePointService: ServicePointService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    localStorage.removeItem('providerServiceID');
    this.servicesList = JSON.parse(localStorage.getItem('services'));
    this.fullName = localStorage.getItem('fullName');

  }

  loginDataResponse: any;
  selectService(service) {
    localStorage.setItem('providerServiceID', service.providerServiceID);
    console.log(localStorage.getItem('provideServiceID'));
    localStorage.setItem('serviceName', service.serviceName);
    localStorage.setItem('serviceID', service.serviceID);
    sessionStorage.setItem('apimanClientKey', service.apimanClientKey);
    this.loginDataResponse = JSON.parse(localStorage.getItem('loginDataResponse'));
    this.checkRoleAndDesingnationMappedForservice(this.loginDataResponse, service);
  }

  checkRoleAndDesingnationMappedForservice(loginDataResponse, service) {
    let serviceData: any;

    if (loginDataResponse.previlegeObj) {
      serviceData = loginDataResponse.previlegeObj.filter((item) => {
        return item.serviceName == service.serviceName
      })[0];

      if (serviceData != null) {
        this.checkMappedRoleForService(serviceData)
      }
    }
  }

  roleArray = []
  checkMappedRoleForService(serviceData) {
    this.roleArray = [];
    let roleData;
    if (serviceData.roles) {
      roleData = serviceData.roles;
      if (roleData.length > 0) {
        roleData.forEach((role) => {
          role.serviceRoleScreenMappings.forEach((serviceRole) => {
            this.roleArray.push(serviceRole.screen.screenName)
          });
        });
        if (this.roleArray && this.roleArray.length > 0) {
          localStorage.setItem('role', JSON.stringify(this.roleArray));
          this.checkMappedDesignation(this.loginDataResponse);
        } else {
          this.confirmationService.alert('Role features are not mapped for user , Please map a role feature', 'error');
        }
      } else {
        this.confirmationService.alert('Role features are not mapped for user , Please map a role feature', 'error');
      }
    } else {
      this.confirmationService.alert('Role features are not mapped for user , Please map a role feature', 'error');
    }
  }

  designation: any;
  checkMappedDesignation(loginDataResponse) {
    if (loginDataResponse.designation && loginDataResponse.designation.designationName) {
      this.designation = loginDataResponse.designation.designationName;
      if (this.designation != null) {
        this.checkDesignationWithRole();
      } else {
        this.confirmationService.alert('Designation is not available for user , Please map the designation', 'error');
      }
    } else {
      this.confirmationService.alert('Designation is not available for user , Please map the designation', 'error');
    }
  }

  checkDesignationWithRole() {
    if (this.roleArray.includes(this.designation)) {
      localStorage.setItem('designation', this.designation);
      this.getSwymedMailLogin();
      this.routeToDesignation(this.designation);
    } else {
      this.confirmationService.alert('Designation is not matched with your roles , Please map the designation or include more roles', 'error');
    }
  }
  getSwymedMailLogin() {
    this.servicePointService.getSwymedMailLogin().subscribe((res) => {
      if (res.statusCode == 200)
        window.location.href = res.data.response
    })
  }
  
  routeToDesignation(designation) {
    switch (designation) {
      case "TC Specialist":
        this.router.navigate(['/common/tcspecialist-worklist']);
        break;
      case "Supervisor":
        this.telemedicineService.routeToTeleMedecine();
        break;
      default:
        this.router.navigate(["/servicePoint"]);
        break;
    }
  }
}
