import {Component, ElementRef, Input, OnInit, Self, ViewChild} from '@angular/core';
import {ControlValueAccessor, NgControl} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})

export class TextAreaComponent implements OnInit, ControlValueAccessor { // form-control
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() label: string;
  @Input() rows: string;

  constructor(@Self() public controlDir: NgControl, public translate: TranslateService) { // new FormControl for text-area
    this.controlDir.valueAccessor = this; // now my TextInputComponent Is FormControl
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];

    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  onChange(event) {}

  onTouched() {}

  writeValue(value: any): void {
    this.input.nativeElement.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}

