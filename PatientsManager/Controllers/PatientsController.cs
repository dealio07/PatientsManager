using System;
using System.Threading.Tasks;
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
            try
            {
                var allPatients = await _patientService.GetAll();
                return Ok(allPatients);
            }
            catch (Exception e)
            {
                return BadRequest("Error trying to get all patients");
            }
        }

        [HttpPut("update/{id:length(24)}")]
        public async Task<IActionResult> Update(string id, PatientDto patientDtoIn)
        {
            try
            {
                var item = await _patientService.Get(id);

                if (item == null)
                {
                    return NotFound();
                }

                await _patientService.Update(id, patientDtoIn);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("Error trying to update patient");
            }
        }

        [HttpDelete("delete/{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var item = await _patientService.Get(id);

                if (item == null)
                {
                    return NotFound();
                }

                await _patientService.Remove(item.Id);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("Error trying to delete patient");
            }
        }
    }
}