using MongoDB.Driver;

namespace PatientsManager.Providers.Abstraction
{
    public interface IMongoDbClientProvider
    {
        public IMongoCollection<T> GetCollection<T>(string collectionName);
    }
}