using System;
using MongoDB.Driver;
using PatientsManager.Models.Interfaces;
using PatientsManager.Providers.Abstraction;

namespace PatientsManager.Providers.Implementation
{
    public class MongoDbClientProvider: IMongoDbClientProvider
    {
        private readonly string _connectionString;
        private readonly string _dbName;
        private MongoClient _client;

        public MongoDbClientProvider(IDatabaseSettings dbSettings)
        {
            _connectionString = dbSettings.ConnectionString;
            _dbName = dbSettings.DatabaseName;
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return GetDatabase().GetCollection<T>(collectionName);
        }

        private IMongoDatabase GetDatabase()
        {
            if (string.IsNullOrEmpty(_dbName))
                throw new ArgumentNullException(nameof(_dbName));

            if (string.IsNullOrEmpty(_connectionString))
                throw new ArgumentNullException(nameof(_connectionString));

            _client ??= new MongoClient(_connectionString);

            return _client.GetDatabase(_dbName);
        }
    }
}