import {Component, ViewChild} from '@angular/core';
import {PatientListComponent} from "../patient-list/patient-list.component";
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent {
  @ViewChild(PatientListComponent) patientList!: PatientListComponent;

  constructor() {}

  onUpload() {
    this.patientList.getPatients();
  }
}
