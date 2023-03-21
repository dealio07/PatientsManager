import {TestBed} from '@angular/core/testing';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Patient} from "../models/patient";
import {GenderEnum} from "../models/gender";
import {PatientService} from "./patient.service";
import {ErrorHandlerService} from "./error-handler.service";
import {of} from "rxjs";
import {MatDialogModule} from "@angular/material/dialog";

describe('PatientService', () => {
  let _service: PatientService;
  let _httpClient: jasmine.SpyObj<HttpClient>;
  const _baseUrl = document.getElementsByTagName('base')[0].href;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule
      ],
      providers: [
        {provide: 'BASE_URL', useValue: _baseUrl},
        ErrorHandlerService,
        PatientService
      ]
    }).compileComponents();

    _httpClient = jasmine.createSpyObj('HttpClient', ['get', 'put', 'delete']);
    const errorHandlerService = TestBed.inject(ErrorHandlerService);
    _service = new PatientService(_httpClient, _baseUrl, errorHandlerService);
  });

  it('should create', () => {
    expect(_service).toBeTruthy();
  });

  it("call to an API to get all patients returns patients", () => {
    let patient: Patient = {
      firstName: "test",
      lastName: "tester",
      birthday: new Date("01/01/1980"),
      gender: GenderEnum.M
    };
    _httpClient.get.and.returnValue(of([patient]));

    _service.getAll()
      .subscribe((patients: Patient[]) =>
      {
        expect(patients).toBeTruthy();
        expect(patients.length).toBe(1);
      });
    expect(_httpClient.get.calls.count()).toBe(1);
  });
});
