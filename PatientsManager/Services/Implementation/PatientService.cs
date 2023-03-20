using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MongoDB.Driver;
using PatientsManager.Models;
using PatientsManager.Providers.Abstraction;
using PatientsManager.Services.Abstraction;

namespace PatientsManager.Services.Implementation
{
    public class PatientService: IPatientService
    {
        private readonly IMongoCollection<PatientDto> _patients;
        private readonly ICsvReader _csvReader;

        public PatientService(IMongoDbClientProvider mongoDbClientProvider, ICsvReader csvReader)
        {
            _patients = mongoDbClientProvider.GetCollection<PatientDto>("Patients");
            _csvReader = csvReader;
        }

        public async Task<List<PatientDto>> GetAll()
        {
            var found = await _patients.FindAsync(i => true);
            var patients = await found.ToListAsync();
            return !patients.Any() 
                ? new List<PatientDto>() 
                : patients.OrderBy(p => p.FirstName)
                    .ThenBy(p => p.LastName)
                    .ToList();
        }

        public async Task CreatePatients(IFormFile file)
        {
            List<PatientDto> patientsFromFile = _csvReader.ReadPatientsData(file);
            if (!patientsFromFile.Any())
            {
                throw new Exception("There are no patient in the file");
            }

            patientsFromFile.ForEach(p =>
            {
                p.Created = DateTime.Now;
                p.Updated = p.Created;
            });
            await _patients.InsertManyAsync(patientsFromFile);
        }

        public async Task<PatientDto> Get(string id)
        {
            var patient = await _patients.FindAsync(i => i.Id == id);
            return await patient.FirstOrDefaultAsync();
        }

        public async Task Update(string id, PatientDto patientDto) {
            patientDto.Updated = DateTime.Now;
            await _patients.ReplaceOneAsync(i => i.Id == id, patientDto);
        }

        public async Task Remove(string id) =>
            await _patients.DeleteOneAsync(i => i.Id == id);
    }
}