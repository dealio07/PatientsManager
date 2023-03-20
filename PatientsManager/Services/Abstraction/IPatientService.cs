using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using PatientsManager.Models;

namespace PatientsManager.Services.Abstraction
{
    public interface IPatientService
    {
        /// <summary>
        /// Retrieves all patients from Database and returns in sorted by First Name and Last Name order
        /// </summary>
        /// <returns>Task&lt;List&lt;PatientDto&gt;&gt;</returns>
        public Task<List<PatientDto>> GetAll();

        /// <summary>
        /// Creates patients in Database
        /// </summary>
        /// <param name="file">a file with patients' data</param>
        /// <returns>Task</returns>
        public Task CreatePatients(IFormFile file);

        /// <summary>
        /// Retrieves a patient from Database by patient's Id
        /// </summary>
        /// <param name="id">patient's Id</param>
        /// <returns>Task&lt;PatientDto&gt;</returns>
        public Task<PatientDto> Get(string id);

        /// <summary>
        /// Updates a patient in Database
        /// </summary>
        /// <param name="id">patient's Id</param>
        /// <param name="patientDto">patient</param>
        public Task Update(string id, PatientDto patientDto);

        /// <summary>
        /// Deletes a patient from Database by patient's Id
        /// </summary>
        /// <param name="id">patient's Id</param>
        public Task Remove(string id);
    }
}