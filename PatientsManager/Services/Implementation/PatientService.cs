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
        private readonly IMongoCollection<PatientDTO> _patients;
        private readonly ICsvReader _csvReader;

        public PatientService(IMongoDbClientProvider mongoDbClientProvider, ICsvReader csvReader)
        {
            _patients = mongoDbClientProvider.GetCollection<PatientDTO>("Patients");
            _csvReader = csvReader;
        }

        public async Task<List<PatientDTO>> Get()
        {
            var found = await _patients.FindAsync(i => true);
            var patients = await found.ToListAsync();
            return !patients.Any() 
                ? new List<PatientDTO>() 
                : patients.OrderBy(p => p.FirstName).ToList();
        }

        public async Task<List<PatientDTO>> CreatePatients(IFormFile file)
        {
            List<PatientDTO> patientsFromFile = _csvReader.ReadPatientsData(file);
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
            return patientsFromFile;
        }

        public async Task<PatientDTO> Get(string id)
        {
            var patient = await _patients.FindAsync(i => i.Id == id);
            return await patient.FirstOrDefaultAsync();
        }

        public async Task<PatientDTO> Create(PatientDTO patientDto)
        {
            patientDto.Created = DateTime.Now;
            patientDto.Updated = DateTime.Now;
            await _patients.InsertOneAsync(patientDto);
            return patientDto;
        }

        public async Task<PatientDTO> Update(string id, PatientDTO patientDto) {
            patientDto.Updated = DateTime.Now;
            await _patients.ReplaceOneAsync(i => i.Id == id, patientDto);
            return patientDto;
        }

        public async Task Remove(string id) =>
            await _patients.DeleteOneAsync(i => i.Id == id);
    }
}