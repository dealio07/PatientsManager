using PatientsManager.Models.Interfaces;

namespace PatientsManager.Models
{
    public class DatabaseSettings: IDatabaseSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}