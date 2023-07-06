import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface SpinnerState {
  show: boolean;
}

@Injectable()
export class SpinnerService {
  spinnerSubject = new Subject<SpinnerState>();
  spinnerState = this.spinnerSubject.asObservable();
  temp = [];

  constructor() { }

  show() {
    this.temp.push(true);
    if (this.temp.length == 1)
      this.spinnerSubject.next(<SpinnerState>{ show: true });
  }

  hide() {
    if (this.temp.length > 0)
      this.temp.pop();

    if (this.temp.length == 0)
      this.spinnerSubject.next(<SpinnerState>{ show: false });
  }

  clear() {
    this.temp = [false];
    this.hide();
  }

}
