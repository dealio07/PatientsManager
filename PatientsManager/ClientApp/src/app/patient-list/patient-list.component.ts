import {Component, Inject, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from "@angular/material/paginator";
import {GenderEnum} from "../models/gender";
import {Patient} from "../models/patient";
import {MatDialog} from "@angular/material/dialog";
import {PatientDialogComponent} from "../patient-dialog/patient-dialog.component";
import {catchError} from "rxjs";

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent {
  private baseUrlPatients = 'patients';

  public patients = new MatTableDataSource<Patient>();
  public patientTableColumns = ["firstName", "lastName", "birthday", "gender", "actions"];
  public pageSizeOptions = [5, 10, 25, 100];
  public pageSize = 5;

  public firstName: string = "";
  public lastName: string = "";
  public birthday: Date = new Date(Date.now());
  public gender: number = 0;

  public genderEnumValues = [
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

  @ViewChild(MatTable, {static: false}) table!: MatTable<Patient>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private dialog: MatDialog) {}

  ngOnInit() {
    this.getPatients();
  }

  ngAfterViewInit() {
    this.patients.paginator = this.paginator;
    this.patients.sort = this.sort;
  }

  onRowClick(event: any) {
    event.target.scrollIntoView();
  }

  filterPatients(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.patients.filter = filterValue.trim().toLowerCase();

    if (!!this.patients.paginator) {
      this.patients.paginator.firstPage();
    }
  }

  getPatients() {
    this.http.get<Patient[]>(`${this.baseUrl}${this.baseUrlPatients}`)
      .pipe(
        catchError((err, caught) => {
          this.dialog.open(PatientDialogComponent, {
            data: {
              title: 'Error',
              content: err.error
            }
          });
          return caught;
        })
      )
      .subscribe((result: Patient[]) => {
        this.patients.data = result;
        this.table.renderRows();
      });
  }

  updatePatient(patient: Patient) {
    if (!patient.isEditing) {
      patient.isEditing = !patient.isEditing;
      return;
    }

    this.http.post(`${this.baseUrl}${this.baseUrlPatients}/update/${patient.id}`, patient)
      .pipe(
        catchError((err, caught) => {
          this.dialog.open(PatientDialogComponent, {
            data: {
              title: 'Error',
              content: err.error
            }
          });
          return caught;
        })
      )
      .subscribe(
        () => {
          let oldPatientIndex = this.patients.data.indexOf(patient);
          patient.isEditing = false;
          this.patients.data[oldPatientIndex] = patient;
          this.patients.data = this.patients.sortData(this.patients.data, this.sort);
          this.table.renderRows();
        });
  }

  removePatient(patient: Patient) {
    this.dialog.open(PatientDialogComponent, {
      data: {
        title: "Delete Patient",
        content: `You are going to delete data of the patient ${patient.firstName} ${patient.lastName}. Are you sure?`,
        actionAccepted: () => {
          this.http.post(`${this.baseUrl}${this.baseUrlPatients}/delete/${patient.id}`, null)
            .pipe(
              catchError((err, caught) => {
                this.dialog.open(PatientDialogComponent, {
                  data: {
                    title: 'Error',
                    content: err.error
                  }
                });
                return caught;
              })
            )
            .subscribe((result: Object) => {
              this.patients.data = this.patients.data.filter(p => p.id != patient.id);
              this.table.renderRows();
            });
        }
      }
    });

  }

  getPatientGender(gender: GenderEnum): string {
    const genderValue = this.genderEnumValues.find(p => p.gender === gender) ?? this.genderEnumValues[0];
    return genderValue.name;
  }
}




