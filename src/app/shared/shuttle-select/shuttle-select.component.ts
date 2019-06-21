import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable } from 'rxjs/index';
import { Option } from './shuttle-select.model';

@Component({
  selector: 'app-shuttle-select',
  templateUrl: './shuttle-select.component.html',
  styleUrls: ['./shuttle-select.component.scss'],
})
export class ShuttleSelectComponent
  implements ControlValueAccessor, OnInit, OnChanges {
  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get availableOptions() {
    return (this.options || [])
      .filter(item => !(this.value || []).some(val => this.equal(val, item.value)))
      .filter(item => item.label.toLowerCase().includes(this.availableSearch.toLocaleLowerCase()))
      .sort(this.sort);
  }

  get selectedOptions() {
    return (this.options || [])
      .filter(item => (this.value || []).some(val => this.equal(val, item.value)))
      .filter(item => item.label.toLowerCase().includes(this.selectedSearch.toLocaleLowerCase()))
      .sort(this.sort);
  }
  @Input()
  placeholder: string;
  @Input()
  options: Array<Option> = [];
  @Input()
  value: Array<any> = [];
  @Input()
  error = '';
  @Input()
  disabled: boolean;
  @Input()
  selectable = true;
  @Input()
  searchable = true;
  @Output()
  selectedChange: EventEmitter<any> = new EventEmitter<any>();

  originalValue = this.value;
  availableSearch = '';
  selectedSearch = '';
  currentAvailableOptions: Array<Option> = [];
  currentSelectedOptions: Array<Option> = [];
  @Input()
  unselectable: Function = () => true
  @Input()
  sort: (a: Option, b: Option) => number = (a, b) =>
    a.label.localeCompare(b.label)
  @Input()
  rowStyle: Function = () => {}

  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      if (this.options && this.options.length === 1) {
        setTimeout(() => {
          this.writeValue(this.options[0].value);
        });
      }
    }
  }

  availableClick(option: Option) {
    if (this.optionSelectable(option)) {
      const index = this.currentAvailableOptions.findIndex(item => item === option);
      if (index >= 0) {
        this.currentAvailableOptions = [
          ...this.currentAvailableOptions.slice(0, index),
          ...this.currentAvailableOptions.slice(index + 1),
        ];
      } else {
        this.currentAvailableOptions = [
          ...this.currentAvailableOptions,
          option,
        ];
      }
    }
  }

  selectedClick(option: Option) {
    if (this.optionSelectable(option)) {
      const index = this.currentSelectedOptions.findIndex(item => item === option);
      if (index >= 0) {
        this.currentSelectedOptions = [
          ...this.currentSelectedOptions.slice(0, index),
          ...this.currentSelectedOptions.slice(index + 1),
        ];
      } else {
        this.currentSelectedOptions = [...this.currentSelectedOptions, option];
      }
    }
  }

  selectCurrent(options: Array<Option> = this.currentAvailableOptions) {
    options.map(option => this.selectOption(option));

    this.currentAvailableOptions = [];
    this.currentSelectedOptions = [];
  }

  selectAll() {
    this.options.map(option => this.selectOption(option));

    this.currentAvailableOptions = [];
    this.currentSelectedOptions = [];
  }

  unselectCurrent(options: Array<Option> = this.currentSelectedOptions) {
    const callback = result => {
      if (result) {
        options.map(option => this.unselectOption(option));
        this.currentAvailableOptions = [];
        this.currentSelectedOptions = [];
      }
    };
    const unselectable = this.unselectable(this.currentAvailableOptions.map(item => item.value));
    if (unselectable instanceof Observable) {
      unselectable.subscribe(callback);
    } else {
      callback(unselectable);
    }
  }

  unselectAll() {
    const callback = result => {
      if (result) {
        this.options.map(option => this.unselectOption(option));
        this.currentAvailableOptions = [];
        this.currentSelectedOptions = [];
      }
    };
    const unselectable = this.unselectable(this.value || []);
    if (unselectable instanceof Observable) {
      unselectable.subscribe(callback);
    } else {
      callback(unselectable);
    }
  }

  private selectOption(option: Option) {
    if (
      this.optionSelectable(option) &&
      !this.value.some(item => this.equal(item, option.value))
    ) {
      this.value = [...this.value, option.value];
      this.changeValue(this.value);
    }
  }

  private unselectOption(option: Option) {
    if (this.optionSelectable(option)) {
      const index = this.value.findIndex(item => this.equal(item, option.value));
      if (index >= 0) {
        this.value = [
          ...this.value.slice(0, index),
          ...this.value.slice(index + 1),
        ];

        this.changeValue(this.value);
      }
    }
  }

  changeValue(value: any) {
    value = value === null ? [] : value;
    value = Array.isArray(value) ? value : [value];
    this.value = value;
    this.onChange(value);
    this.selectedChange.emit(value);
    if (JSON.stringify(this.originalValue) === JSON.stringify(this.value)) {
      if (this.ngControl && this.ngControl.control) {
        this.ngControl.control.markAsPristine();
      }
    }
  }

  writeValue(value: any) {
    this.originalValue = value;
    this.changeValue(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  optionSelectable(option: Option) {
    return (
      option && !this.disabled && this.selectable && option && !option.disabled
    );
  }

  equal(value, option): boolean {
    if (value === option) {
      return true;
    }
    if (Array.isArray(value) && Array.isArray(option)) {
      return JSON.stringify(value) === JSON.stringify(option);
    }

    if (typeof value === 'object' && typeof option === 'object') {
      return Object.keys(option).reduce((acc, key) => acc && option[key] === value[key], true);
    }


    return false;
  }
}
