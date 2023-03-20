import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PatientListComponent} from './patient-list.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSortModule} from "@angular/material/sort";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Patient} from "../models/patient";
import {GenderEnum} from "../models/gender";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('PatientListComponent', () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const baseUrl = document.getElementsByTagName('base')[0].href;

  const mockGetPatients = (result: Patient[]) => {
    const req = httpTestingController.expectOne(`${baseUrl}patients`);
    expect(req.request.method).toEqual('GET');
    req.flush(result);
    httpTestingController.verify();
  }

  beforeEach(async () => {
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
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: 'BASE_URL', useValue: baseUrl}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    mockGetPatients([]);
    expect(component).toBeTruthy();
  });

  it('fills patients data', () => {
    let patient: Patient = {
      firstName: "test",
      lastName: "tester",
      birthday: new Date("01/01/1980"),
      gender: GenderEnum.M,
      isEditing: false
    };
    mockGetPatients([patient]);

    expect(component.patients.data).toBeDefined();
    expect(component.patients.data.length).toEqual(1);
    expect(component.patients.data[0]).toEqual(patient);
  });

  it('edits patient', () => {
    mockGetPatients([]);

    let patient: Patient = {
      firstName: "test",
      lastName: "tester",
      birthday: new Date("01/01/1980"),
      gender: GenderEnum.M,
      isEditing: false
    };
    component.editPatient(patient);
    expect(patient.isEditing).toBeTruthy();
  });

  it("doesn't update patient when isEditing is false", () => {
    mockGetPatients([]);
    let patient: Patient = {
      firstName: "test",
      lastName: "tester",
      birthday: new Date("01/01/1980"),
      gender: GenderEnum.M,
      isEditing: false
    };
    component.updatePatient(patient);
    expect(component.patientHasChanged(patient)).toBeTruthy();
    expect(patient.isEditing).toBeFalsy();
  });

  it('updates patient when isEditing is true', () => {
    mockGetPatients([]);
    let patient: Patient = {
      id: "1",
      firstName: "test",
      lastName: "tester",
      birthday: new Date("01/01/1980"),
      gender: GenderEnum.M,
      isEditing: true
    };

    component.form.setValue({
      "firstName": "testing",
      "lastName": patient.lastName,
      "birthday": patient.birthday,
      "gender": patient.gender
    });

    expect(component.patientHasChanged(patient)).toBeTruthy();

    component.updatePatient(patient);
    const req = httpTestingController.expectOne(`${baseUrl}patients/update/${patient.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush({});
    httpTestingController.verify();

    expect(patient.isEditing).toBeFalsy();
  });

  it('gets patient gender', () => {
    mockGetPatients([]);
    expect(component.getPatientGender(GenderEnum.Unknown)).toEqual(component.genderEnumValues[0].name);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
