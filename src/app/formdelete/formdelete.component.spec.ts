import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormdeleteComponent } from './formdelete.component';

describe('FormdeleteComponent', () => {
  let component: FormdeleteComponent;
  let fixture: ComponentFixture<FormdeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormdeleteComponent]
    });
    fixture = TestBed.createComponent(FormdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
