import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[myHealthId]",
})
export class myHealthId {
  constructor(element: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    // var regex = new RegExp(/^[0-9a-zA-Z_.]*$/);
    var regex = new RegExp(/^[~!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/);
    var key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
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
