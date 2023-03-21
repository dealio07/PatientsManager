import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PatientCsvUploaderComponent} from './patient-csv-uploader.component';
import {MatDialogModule} from "@angular/material/dialog";
import {FileService} from "../services/file.service";
import {HttpClientModule} from "@angular/common/http";
import {ErrorHandlerService} from "../services/error-handler.service";

describe('PatientCsvUploaderComponent', () => {
  let _component: PatientCsvUploaderComponent;
  let _fixture: ComponentFixture<PatientCsvUploaderComponent>;
  const _baseUrl = document.getElementsByTagName('base')[0].href;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientCsvUploaderComponent],
      imports: [
        HttpClientModule,
        MatDialogModule,
      ],
      providers: [
        {provide: 'BASE_URL', useValue: _baseUrl},
        FileService,
        ErrorHandlerService
      ]
    })
      .compileComponents();

    _fixture = TestBed.createComponent(PatientCsvUploaderComponent);
    _component = _fixture.componentInstance;
    _fixture.detectChanges();
  });

  it('should create', () => {
    expect(_component).toBeTruthy();
  });

  it('validate file returns true when file is valid', () => {
    const file: File = new File(
      [new Blob(['some content'])],
      'file',
      {type: 'text/csv'});
    expect(_component.validateFile(file)).toBeTruthy();
  });

  it('validate file returns false when file is invalid', () => {
    const file: File = new File(
      [new Blob(['some content'])],
      'file');
    expect(_component.validateFile(file)).toBeFalsy();
  });
});
