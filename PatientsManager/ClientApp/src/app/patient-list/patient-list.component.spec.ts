import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PatientListComponent} from './patient-list.component';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSortModule} from '@angular/material/sort';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Patient} from '../models/patient';
import {GenderEnum} from '../models/gender';
import {PatientService} from '../services/patient.service';
import {of} from 'rxjs';

describe('PatientListComponent', () => {
  let _component: PatientListComponent;
  let _fixture: ComponentFixture<PatientListComponent>;
  let _patientService: jasmine.SpyObj<PatientService>;
  const _baseUrl = document.getElementsByTagName('base')[0].href;
  let _patient: Patient;

  beforeEach(async () => {
    _patientService = jasmine.createSpyObj('PatientService', ['getAll', 'update', 'delete']);

    await TestBed.configureTestingModule({
      declarations: [PatientListComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatTableModule,
        MatGridListModule,
        MatRadioModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule
      ],
      providers: [
        {provide: 'BASE_URL', useValue: _baseUrl},
        {provide: PatientService, useValue: _patientService}
      ]
    }).compileComponents();

    _fixture = TestBed.createComponent(PatientListComponent);
    _component = _fixture.componentInstance;

    // Component pulls patient in ngOnInit hook
    _patient = {
      firstName: 'test',
      lastName: 'tester',
      birthday: new Date('01/01/1980'),
      gender: GenderEnum.M,
      isEditing: false
    };
    _patientService.getAll.and.returnValue(of([_patient]));
    _patientService.update.and.returnValue(of(Object));
    _patientService.delete.and.returnValue(of(Object));

    _fixture.detectChanges();
  });

  it('should create', () => {
    expect(_component).toBeTruthy();
  });

  it('fills patients data', () => {
    expect(_component._patients.data).toBeDefined();
    expect(_component._patients.data.length).toEqual(1);
    expect(_component._patients.data[0]).toEqual(_patient);
  });

  it('editPatient changes patient isEditing status', () => {

    let patient: Patient = {..._patient};

    _component.editPatient(patient);

    expect(patient.isEditing).toBeTruthy();
    expect(patient.isEditing !== _patient.isEditing).toBeTruthy();
  });

  it('patientHasChanged returns true when the form was edited', () => {
    let patient: Patient = {..._patient};

    _component._form.setValue({
      'firstName': 'testing',
      'lastName': patient.lastName,
      'birthday': patient.birthday,
      'gender': patient.gender
    });

    expect(_component.patientHasChanged(patient)).toBeTruthy();
  });

  it('patientHasChanged returns false when the form is untouched', () => {
    let patient: Patient = {..._patient};

    _component._form.setValue({
      'firstName': patient.firstName,
      'lastName': patient.lastName,
      'birthday': patient.birthday,
      'gender': patient.gender
    });

    expect(_component.patientHasChanged(patient)).toBeFalsy();
  });

  it('updates patient when isEditing is true', () => {
    _patient.firstName = 'testing';
    _component._form.setValue({
      'firstName': _patient.firstName,
      'lastName': _patient.lastName,
      'birthday': _patient.birthday,
      'gender': _patient.gender
    });

    _component.updatePatient(_patient);

    expect(_patient.isEditing).toBeFalsy();
    expect(_component._patients.data[0].firstName).toBe('testing');
  });

  it('does not update patient when isEditing is false', () => {
    let patient: Patient = {..._patient};

    _component.updatePatient(patient);

    expect(_component.patientHasChanged(patient)).toBeTruthy();
    expect(patient.isEditing).toBeFalsy();
    expect(patient.isEditing === _patient.isEditing).toBeTruthy();
  });

  it('gets patient gender', () => {
    expect(_component.getPatientGender(GenderEnum.Unknown)).toEqual(_component._genderEnumValues[0].name);
  });
});
