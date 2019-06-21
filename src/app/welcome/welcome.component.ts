import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Option } from '../shared/shuttle-select/shuttle-select.model';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  title = 'Angular-Demo';
  form = this.fb.group({
    fruits: [[]],
  });
  fruitOptions: Option[] = [];

  ngOnInit(): void {
    // call API to fetch options
    this.fruitOptions = [
      { value: 0, label: 'Apple' },
      { value: 1, label: 'Banana' },
      { value: 2, label: 'Cherry' },
      { value: 3, label: 'Date' },
      { value: 4, label: 'Endive' },
      { value: 5, label: 'Fig' },
      { value: 6, label: 'Grape' },
    ];
  }

  get selected() {
    return JSON.stringify(
      (this.form.get('fruits').value || []).map(value => this.fruitOptions.find(option => option.value === value)),
      null,
      4,
    );
  }
}
