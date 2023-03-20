using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Http;
using PatientsManager.Models;
using PatientsManager.Services.Abstraction;

namespace PatientsManager.Services.Implementation
{
    public class CsvReaderService : ICsvReader
    {
        public List<PatientDto> ReadPatientsData(IFormFile file)
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                Delimiter = ","
            };
            // Read the CSV file and parse the data
            using var streamReader = new StreamReader(file.OpenReadStream());
            using var csvReader = new CsvReader(streamReader, config);
            csvReader.Context.RegisterClassMap<PatientDTOMap>();

            var patients = csvReader.GetRecords<PatientDto>();

            // Convert the CSV data to Patient entities and save to MongoDB
            return patients.Select(patient =>
                new PatientDto
                {
                    FirstName = patient.FirstName,
                    LastName = patient.LastName,
                    Birthday = patient.Birthday,
                    Gender = patient.Gender
                }).ToList();
        }
    }
}