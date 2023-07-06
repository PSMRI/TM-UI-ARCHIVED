import { Directive, ElementRef, Attribute, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[defaultNull]",
})
export class NullDefaultValueDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener("input", ["$event.target"])
  onEvent(target: HTMLInputElement) {
    this.control.control.setValue(target.value === "" ? null : target.value);
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
