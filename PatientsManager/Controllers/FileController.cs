using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PatientsManager.Services.Abstraction;

namespace PatientsManager.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public FileController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpPost("upload-csv")]
        public async Task<IActionResult> SavePatientsFromFile(IFormFile file)
        {
            if (file == null)
            {
                return BadRequest("No file was sent");
            }

            try
            {
                await _patientService.CreatePatients(file);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("Error during file upload");
            }
        }
    }
}