import { async, ComponentFixture, tick, inject, fakeAsync, TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { AppHeaderComponent } from './app-header.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../core/material.module';


class RouterStub {
  navigate(something) {

  }
}
class MockActivatedRoute {

  snapshot = {
    params: [null]
  }
}
class authServiceMock {

  logoutUser() {

  }
}


describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [ MaterialModule, NoopAnimationsModule],
      declarations: [ AppHeaderComponent ],
      providers: [{ provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        {provide: AuthService, useClass: authServiceMock}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.showRoles = false;
    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
    window.localStorage.setItem('servicePointName', 'Barpeta SP');
    window.localStorage.setItem('userName', 'Prabhsimran Singh');
    window.sessionStorage.setItem('isAuthenticated', 'true');
  });


  it('should create app header component', () => {
    expect(component).toBeTruthy();
  });

  it('should get servicePointName from localstorage when init', () => {
    fixture.autoDetectChanges();
    expect(component.servicePoint).toEqual(window.localStorage.getItem('servicePointName'));
  })

  it('should get userName from localstorage when init', () => {
    fixture.autoDetectChanges();
    expect(component.userName).toEqual(window.localStorage.getItem('userName'));
  })

  it('should get isAuthenticated from localstorage when init', () => {
    fixture.autoDetectChanges();
    expect((component.isAuthenticated).toString()).toBe(window.sessionStorage.getItem('isAuthenticated'));
  })

  it('should keep roles as undefined as we\'ve kept showroles as no', () => {
    fixture.autoDetectChanges();
    expect(component.roles).toBe(undefined);
  })

  it('should keep filteredNavigation as undefined as we\'ve kept showroles as no', () => {
    fixture.autoDetectChanges();
    expect(component.filteredNavigation).toBe(undefined);
  })


  it('should set roles as per save in localstorage when we have showRoles set to true', () => {
    component.showRoles = true;
    const role = '["Registrar","Nurse","Doctor","TC Specialist","Oncologist","Lab Technician","Pharmacist"]';
    window.localStorage.setItem('role', role);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.roles).toBeTruthy();
  })

  it('should not set roles as per save in localstorage when we don\'t have showRoles set to true', () => {
    const role = '["Registrar","Nurse","Doctor","TC Specialist","Oncologist","Lab Technician","Pharmacist"]';
    window.localStorage.setItem('role', role);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.roles).not.toBeTruthy();
  })

  it('should filteredNavigation as per save in localstorage when we have showRoles set to true', () => {
    component.showRoles = true;
    const role = '["Registrar","Nurse","Doctor","TC Specialist","Oncologist","Lab Technician","Pharmacist"]';
    window.localStorage.setItem('role', role);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.filteredNavigation).toBeTruthy();
  })

  it('should call logout method on click of logout tag', fakeAsync(() => {
    const spy = spyOn(authService, 'logoutUser').and.returnValue(Observable.of(1));
    component.ngOnInit();
    fixture.detectChanges();
    let el = fixture.debugElement.query(By.css('#logoutButton'));
    el.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('should not clear local storage asresponse is not correct', () => {
    const spy = spyOn(authService, 'logoutUser').and.returnValue(Observable.of({ statusCode: 401}));
    component.ngOnInit();
    component.logout();

    expect(localStorage.length).not.toEqual(0);
  });

  it('should not clear session storage asresponse is not correct', () => {
    const spy = spyOn(authService, 'logoutUser').and.returnValue(Observable.of({ statusCode: 401 }));
    component.ngOnInit();
    component.logout();

    expect(sessionStorage.length).not.toEqual(0);
  });

  it('should  clear local storage as response is  correct', () => {
    const spy = spyOn(authService, 'logoutUser').and.returnValue(Observable.of({ statusCode: 200 }));
    component.ngOnInit();
    component.logout();

    expect(localStorage.length).toEqual(0);
  });

  it('should  clear local storage as response is  correct', () => {
    const spy = spyOn(authService, 'logoutUser').and.returnValue(Observable.of({ statusCode: 200 }));
    component.ngOnInit();
    component.logout();

    expect(sessionStorage.length).toEqual(0);
  });

  it('should call to navigate to other component', () => {
    const spy = spyOn(authService, 'logoutUser').and.returnValue(Observable.of({ statusCode: 200 }));
    const spier = spyOn(router, 'navigate');
    component.ngOnInit();
    component.logout();
    expect(spier).toHaveBeenCalled();
  });

  it('should call to navigate to login component', () => {
    const spy = spyOn(authService, 'logoutUser').and.returnValue(Observable.of({ statusCode: 200 }));    
    const spier = spyOn(router, 'navigate');
    component.ngOnInit();
    component.logout();
    expect(spier).toHaveBeenCalledWith(['/login']);
  });


});
