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
        public List<PatientDTO> ReadPatientsData(IFormFile file)
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

            var patients = csvReader.GetRecords<PatientDTO>();

            // Convert the CSV data to Patient entities and save to MongoDB
            return patients.Select(patient =>
                new PatientDTO
                {
                    FirstName = patient.FirstName,
                    LastName = patient.LastName,
                    Birthday = patient.Birthday,
                    Gender = patient.Gender
                }).ToList();
        }
    }
}