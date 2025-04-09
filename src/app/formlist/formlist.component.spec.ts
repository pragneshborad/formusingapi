import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlistComponent } from './formlist.component';

describe('FormlistComponent', () => {
  let component: FormlistComponent;
  let fixture: ComponentFixture<FormlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormlistComponent]
    });
    fixture = TestBed.createComponent(FormlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
