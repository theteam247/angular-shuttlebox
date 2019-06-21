import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ShuttleSelectComponent } from './shuttle-select.component';

describe('ShuttleSelectComponent', () => {
  let component: ShuttleSelectComponent;
  let fixture: ComponentFixture<ShuttleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShuttleSelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuttleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
