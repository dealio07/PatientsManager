using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PatientsManager.Models;
using PatientsManager.Services.Abstraction;

namespace PatientsManager.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientsController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            return Ok(await _patientService.Get());
        }

        [HttpPost("upload-csv")]
        public async Task<IActionResult> SavePatients(IFormFile file)
        {
            if (file == null)
            {
                return BadRequest("No file was sent");
            }

            return Ok(await _patientService.CreatePatients(file));
        }
        
        [HttpGet("{id:length(24)}")]
        public async Task<IActionResult> Get(string id)
        {
            var item = await _patientService.Get(id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }
        
        [HttpPost("create")]
        public async Task<IActionResult> Create(PatientDTO patientDto)
        {
            if (patientDto == null)
            {
                return BadRequest("There is no patient to add");
            }

            return Ok(await _patientService.Create(patientDto));
        }

        [HttpPost("update/{id:length(24)}")]
        public async Task<IActionResult> Update(string id, PatientDTO patientDtoIn)
        {
            var item = await _patientService.Get(id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(await _patientService.Update(id, patientDtoIn));
        }

        [HttpPost("delete/{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _patientService.Get(id);

            if (item == null)
            {
                return NotFound();
            }

            await _patientService.Remove(item.Id);

            return Ok();
        }
    }
}