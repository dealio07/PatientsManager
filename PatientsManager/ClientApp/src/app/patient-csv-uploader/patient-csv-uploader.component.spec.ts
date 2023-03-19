import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCsvUploaderComponent } from './patient-csv-uploader.component';

describe('PatientCsvUploaderComponent', () => {
  let component: PatientCsvUploaderComponent;
  let fixture: ComponentFixture<PatientCsvUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCsvUploaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCsvUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
