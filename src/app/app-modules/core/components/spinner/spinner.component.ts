import { Component, OnDestroy, OnInit, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SpinnerState, SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnDestroy, OnInit, OnChanges {
  @Input('module')
  role: string;

  visible = false;

  private spinnerStateChanged: Subscription;

  constructor(
    private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinnerStateChanged = this.spinnerService.spinnerState
      .subscribe((state: SpinnerState) => {
        if (this.visible != state.show){
          console.log("spinner called once");
          this.visible = state.show;
        }
      });
  }

  ngOnChanges() {
    console.log('I am groot', this.role);
  }

  ngOnDestroy() {
    this.spinnerStateChanged.unsubscribe();
  }
}
