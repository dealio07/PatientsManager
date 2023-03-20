using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using PatientsManager.Models;

namespace PatientsManager.Services.Abstraction
{
    public interface ICsvReader
    {
        public List<PatientDto> ReadPatientsData(IFormFile file);
    }
}