import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientCsvUploaderComponent } from './patient-csv-uploader.component';
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";

describe('PatientCsvUploaderComponent', () => {
  let component: PatientCsvUploaderComponent;
  let fixture: ComponentFixture<PatientCsvUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCsvUploaderComponent ],
      imports: [
        HttpClientModule,
        MatDialogModule,
      ],
      providers: [
        {provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCsvUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validate file returns true when file is valid', () => {
    const file: File = new File(
      [new Blob(['some content'])],
      'file',
      {type:'text/csv'});
    expect(component.validateFile(file)).toBeTruthy();
  });

  it('validate file returns false when file is invalid', () => {
    const file: File = new File(
      [new Blob(['some content'])],
      'file');
    expect(component.validateFile(file)).toBeFalsy();
  });
});
