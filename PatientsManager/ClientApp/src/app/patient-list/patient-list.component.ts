import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from "@angular/material/paginator";
import {GenderEnum} from "../models/gender";
import {Patient} from "../models/patient";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PatientDialogComponent} from "../patient-dialog/patient-dialog.component";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PatientService} from "../services/patient.service";

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent {

  public _patients = new MatTableDataSource<Patient>();
  public _patientTableColumns = ["firstName", "lastName", "birthday", "gender", "actions"];
  public _pageSizeOptions = [5, 10, 25, 100];
  public _pageSize = 5;
  public _genderEnumValues = [
    {
      gender: GenderEnum.Unknown,
      name: "Unknown"
    },
    {
      gender: GenderEnum.M,
      name: "Male"
    },
    {
      gender: GenderEnum.F,
      name: "Female"
    }
  ];

  @ViewChild(MatTable, {static: false}) _table!: MatTable<Patient>;
  @ViewChild(MatSort) _sort!: MatSort;
  @ViewChild(MatPaginator) _paginator!: MatPaginator;

  public _form: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    birthday: new FormControl('MM/dd/yyyy', [Validators.required]),
    gender: new FormControl('', [Validators.required])
  });

  public _dialogRef: MatDialogRef<PatientDialogComponent, any> | undefined;

  constructor(public _patientService: PatientService, public _dialog: MatDialog) {}

  ngOnInit() {
    this.getPatients();
  }

  ngAfterViewInit() {
    this._patients.paginator = this._paginator;
    this._patients.sort = this._sort;
  }

  onRowClick(event: any) {
    event.target.scrollIntoView();
  }

  filterPatients(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this._patients.filter = filterValue.trim().toLowerCase();

    if (!!this._patients.paginator) {
      this._patients.paginator.firstPage();
    }
  }

  getPatients() {
    this._patientService
      .getAll()
      .subscribe((result: Patient[]) => {
        this._patients.data = result;
        this._table.renderRows();
      });
  }

  editPatient(patient: Patient) {
    patient.isEditing = !patient.isEditing;

    if (patient.isEditing) {
      this._form.patchValue({
        firstName: patient.firstName,
        lastName: patient.lastName,
        birthday: patient.birthday,
        gender: patient.gender
      });
    }
  }

  updatePatient(patient: Patient) {
    if (!patient.isEditing || this._form.invalid || !this.patientHasChanged(patient)) {
      return;
    }

    patient.firstName = this._form.get("firstName")?.value;
    patient.lastName = this._form.get("lastName")?.value;
    patient.birthday = this._form.get("birthday")?.value;
    patient.gender = this._form.get("gender")?.value;

    this._patientService
      .update(patient)
      .subscribe(
        () => {
          let oldPatientIndex = this._patients.data.indexOf(patient);
          patient.isEditing = false;
          this._patients.data[oldPatientIndex] = patient;
          this._patients.data = this._patients.sortData(this._patients.data, this._sort);
          this._table.renderRows();
        });
  }

  removePatient(patient: Patient) {
    if (!!this._dialogRef) {
      return;
    }

    this._dialogRef = this._dialog.open(PatientDialogComponent, {
      data: {
        title: "Delete Patient",
        content: `You are going to delete data of the patient ${patient.firstName} ${patient.lastName}. Are you sure?`,
        requiresResult: true
      }
    });
    this._dialogRef.afterClosed()
      .subscribe(value => {
        this._dialogRef = undefined;
        if (!value) {
          return;
        }
        this._patientService
          .delete(patient)
          .subscribe(() => {
            this._patients.data = this._patients.data.filter(p => p.id != patient.id);
            this._table.renderRows();
          });
      });

  }

  cancelEditing(patient: Patient) {
    patient.isEditing = !patient.isEditing;
  }

  getPatientGender(gender: GenderEnum): string {
    const genderValue = this._genderEnumValues.find(p => p.gender === gender) ?? this._genderEnumValues[0];
    return genderValue.name;
  }

  showFormError(controlName: string, errorName: string) {
    return this._form.controls[controlName].hasError(errorName);
  }

  patientHasChanged(patient: Patient): boolean {
    return this._form.get("firstName")?.value !== patient.firstName
      || this._form.get("lastName")?.value !== patient.lastName
      || this._form.get("birthday")?.value !== patient.birthday
      || this._form.get("gender")?.value !== patient.gender;
  }
}




