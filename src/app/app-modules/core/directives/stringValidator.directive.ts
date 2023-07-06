import {
  Directive,
  ElementRef,
  Attribute,
  HostListener,
  Input,
} from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";

@Directive({
  selector:
    "[allowText][formControlName],[allowText][formControl],[allowText][ngModel],[allowText]",
})
export class StringValidator {
  @Input()
  allowText: string;

  alphabet = /^[a-zA-Z]+$/;
  alphaspace = /^[a-zA-Z ]+$/;
  alphanumeric = /^[a-zA-Z0-9]+$/;
  alphanumericspace = /^[a-zA-Z0-9 ]+$/;
  alphanumerichyphen = /^[a-zA-Z0-9-/ ]+$/;
  numerichyphen = /^[0-9- ]+$/;
  number = /^[0-9]+$/;
  // decimal = /^[0-9.]+$/;
  decimal = /^\d+(\.\d{0,2})?$/;
  numberslash = /^[0-9/]+$/;
  address = /^[a-zA-Z0-9-./,# ]+$/;

  inputFieldValidator = /^[a-zA-Z0-9 ]+$/;
  textAreaValidator = /^[a-zA-Z0-9., ]+$/;
  questionnaireValidator = /^[a-zA-Z0-9.,? ]+$/;
  addressValidator = /^[a-zA-Z0-9.,/\-# ]+$/;
  smsTemplateValidator = /^[a-zA-Z0-9.,$\-:;/() ]+$/;
  itemNameSearchValidator = /^[a-zA-Z0-9% ]+$/;
  itemNameMasterValidator = /^[a-zA-Z0-9%-.[\]\/() ]+$/;
  answerValidator = /^[a-zA-Z0-9.,/\- ]+$/;
  usernameValidator = /^[a-zA-Z0-9]+$/;
  lastValue = null;
  result: boolean;

  constructor(private elementRef: ElementRef) {}

  validate(input) {
    let patternCode = this.allowText.trim();

    if (input == null || input == "") return false;

    switch (patternCode) {
      case "alphabet":
        this.result = this.alphabet.test(input);
        break;
      case "alphaspace":
        this.result = this.alphaspace.test(input);
        break;
      case "alphanumeric":
        this.result = this.alphanumeric.test(input);
        break;
      case "alphanumericspace":
        this.result = this.alphanumericspace.test(input);
        break;
      case "number":
        this.result = this.number.test(input);
        break;
      case "numberslash":
        this.result = this.numberslash.test(input);
        break;
      case "alphanumerichyphen":
        this.result = this.alphanumerichyphen.test(input);
        break;
      case "numerichyphen":
        this.result = this.numerichyphen.test(input);
        break;
      case "decimal":
        this.result = this.decimal.test(input);
        break;
      case "address":
        this.result = this.address.test(input);
        break;
      case "inputFieldValidator":
        this.result = this.inputFieldValidator.test(input);
        break;
      case "textAreaValidator":
        this.result = this.textAreaValidator.test(input);
        break;
      case "questionnaireValidator":
        this.result = this.questionnaireValidator.test(input);
        break;
      case "addressValidator":
        this.result = this.addressValidator.test(input);
        break;
      case "smsTemplateValidator":
        this.result = this.smsTemplateValidator.test(input);
        break;
      case "itemNameSearchValidator":
        this.result = this.itemNameSearchValidator.test(input);
        break;
      case "itemNameMasterValidator":
        this.result = this.itemNameMasterValidator.test(input);
        break;
      case "answerValidator":
        this.result = this.answerValidator.test(input);
        break;
      case "usernameValidator":
          this.result = this.usernameValidator.test(input);
          break;
      default:
        this.result = false;
    }
    return this.result;
  }

  @HostListener("input", ["$event"])
  onInput(event: any) {
    let val = event.target.value;
    let lastVal = this.lastValue;
    let maxlength = event.target.maxLength;

    if (this.allowText.trim() == "decimal") {
      if (val == "") {
        event.target.value = "";
      } else if (!this.validate(val)) {
        event.target.value = lastVal;
      }
    } else if (this.allowText.trim() == "number") {
      if (event.target.length > 0) {
        this.validateEntry(val, lastVal, maxlength, event);
      } else {
        this.checkForZeroEntry(val, lastVal, maxlength, event);
      }
    } else {
      this.validateEntry(val, lastVal, maxlength, event);
    }
    this.lastValue = event.target.value;
  }
  validateEntry(val, lastVal, maxlength, event) {
    var inserted = this.findDelta(val, lastVal);
    // get removed chars
    var removed = this.findDelta(lastVal, val);
    // determine if user pasted content
    var pasted = inserted.length >= 1 || (!inserted && !removed);

    if (maxlength > 0 && val.length > maxlength) {
      event.target.value = lastVal;
    } else {
      if (pasted) {
        if (!this.isValidString(val)) event.target.value = lastVal;
      } else if (!removed) {
        if (!this.isValidChar(inserted)) event.target.value = lastVal;
      }
    }
  }
  checkForZeroEntry(val, lastVal, maxlength, event) {
    console.log(
      "val, lastVal, maxlength, event",
      val,
      lastVal,
      maxlength,
      event
    );
    if (val == "0") {
      event.target.value = "";
    } else {
      this.validateEntry(val, lastVal, maxlength, event);
    }
  }

  @HostListener("focus", ["$event"])
  onFocus(event: any) {
    let input = event.target.value;
    this.lastValue = input;
  }

  findDelta(value, prevValue) {
    let delta = "";

    for (let i = 0; i < value.length; i++) {
      let str =
        value.substr(0, i) + value.substr(i + value.length - prevValue.length);

      if (str === prevValue)
        delta = value.substr(i, value.length - prevValue.length);
    }

    return delta;
  }

  isValidChar(c) {
    return this.validate(c);
  }

  isValidString(str) {
    for (let i = 0; i < str.length; i++)
      if (!this.isValidChar(str.substr(i, 1))) return false;
    return true;
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
