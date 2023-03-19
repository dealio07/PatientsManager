import {Component, EventEmitter, Inject, Output, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-csv-uploader',
  templateUrl: './patient-csv-uploader.component.html',
  styleUrls: ['./patient-csv-uploader.component.css']
})
export class PatientCsvUploaderComponent {
  private baseUrlPatients = 'patients';

  @ViewChild('fileInput') fileInput: any;
  @Output('upload') uploadEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

  upload(files: FileList | null) {
    if (files === null || files.length === 0)
    {
      return;
    }

    const file = <File>files?.item(0);
    if (!this.validateFile(file))
    {
      return;
    }

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('columns', 'First Name,Last Name,Birthday,Gender');

    this.http.post(`${this.baseUrl}${this.baseUrlPatients}/upload-csv`, formData).subscribe(() => {
      this.fileInput.nativeElement.value = '';
      this.uploadEvent.emit();
    });
  }

  validateFile(file: any) {
    if (!file || !file.name) {
      return false;
    }
    let filename = file.name;
    filename = filename.split('.');
    const filetype = filename.pop();
    return filetype.toLowerCase() === 'csv';
  }
}
