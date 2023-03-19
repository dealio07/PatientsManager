using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using PatientsManager.Models;

namespace PatientsManager.Services.Abstraction
{
    public interface IPatientService
    {
        public Task<List<PatientDTO>> Get();
        public Task<List<PatientDTO>> CreatePatients(IFormFile file);

        public Task<PatientDTO> Get(string id);

        public Task<PatientDTO> Create(PatientDTO patientDto);

        public Task<PatientDTO> Update(string id, PatientDTO patientDto);

        public Task Remove(string id);
    }
}