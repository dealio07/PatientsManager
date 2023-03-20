using CsvHelper.Configuration;

namespace PatientsManager.Models
{
    public sealed class PatientDTOMap : ClassMap<PatientDto>
    {
        public PatientDTOMap()
        {
            Map(m => m.FirstName).Name("First Name");
            Map(m => m.LastName).Name("Last Name");
            Map(m => m.Birthday).Name("Birthday");
            Map(m => m.Gender).Name("Gender");
        }
    }
}