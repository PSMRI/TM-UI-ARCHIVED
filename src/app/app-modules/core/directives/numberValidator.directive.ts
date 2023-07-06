import {
  Directive,
  ElementRef,
  Attribute,
  HostListener,
  Input,
} from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Directive({
  selector:
    "[allowMax][formControlName],[allowMax][formControl],[allowMax][ngModel],[allowMax]",
})
export class NumberValidator {
  @Input("allowMax")
  public max: number;

  constructor(private elementRef: ElementRef) {}

  validate(input) {
    let max = this.max;

    if (+input <= +max) return true;
    else return false;
  }

  @HostListener("input", ["$event"])
  onInput(event: any) {
    let value = event.target.value;

    if (!this.validate(value)) event.target.value = this.lastValue;

    this.lastValue = event.target.value;
  }

  lastValue = null;
  @HostListener("focus", ["$event"])
  onFocus(event: any) {
    this.lastValue = event.target.value;
  }
  @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener("copy", ["$event"]) blockCopy(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener("cut", ["$event"]) blockCut(event: KeyboardEvent) {
    event.preventDefault();
  }
}
