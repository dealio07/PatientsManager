using Microsoft.AspNetCore.Http;
using MongoDB.Driver;
using Moq;
using PatientsManager.Models;
using PatientsManager.Models.Enums;
using PatientsManager.Providers.Abstraction;
using PatientsManager.Services.Abstraction;
using PatientsManager.Services.Implementation;

namespace PatientsManager.Test
{
    [TestFixture]
    public class PatientServiceTests
    {
        private Mock<IMongoDbClientProvider> _mongoDbClientProviderMock;
        private Mock<ICsvReader> _csvReaderMock;
        private Mock<IMongoCollection<PatientDto>> _patientsCollectionMock;
        private IPatientService _patientService;
        private Mock<IFormFile> _mockFormFile;
        
        
        private readonly List<PatientDto> _expectedPatients = new ()
        {
            new ()
            {
                Id = "1", 
                FirstName = "Clark", 
                LastName = "Kent", 
                Birthday = DateTime.Parse("1984-02-29"), 
                Gender = GenderEnum.M
            },
            new ()
            {
                Id = "2", 
                FirstName = "Diana", 
                LastName = "Prince", 
                Birthday = DateTime.Parse("1976-03-22"), 
                Gender = GenderEnum.F
            }
        };

        private List<PatientDto> _expectedPatientsOrdered;

        [SetUp]
        public void Setup()
        {
            _expectedPatientsOrdered = _expectedPatients.OrderBy(p => p.FirstName).ThenBy(p => p.LastName).ToList();
            _mongoDbClientProviderMock = new Mock<IMongoDbClientProvider>();
            _csvReaderMock = new Mock<ICsvReader>();
            _patientsCollectionMock = new Mock<IMongoCollection<PatientDto>>();
            _mongoDbClientProviderMock.Setup(x => x.GetCollection<PatientDto>("Patients"))
                .Returns(_patientsCollectionMock.Object);

            _patientService = new PatientService(_mongoDbClientProviderMock.Object, _csvReaderMock.Object);

            _mockFormFile = new Mock<IFormFile>();
        }

        [Test]
        public async Task GetAll_ShouldReturnOrderedPatientList_WhenPatientsExist()
        {
            // Arrange
            MockFindAsyncToReturnValue(_expectedPatients);

            // Act
            var actualPatients = await _patientService.GetAll();

            // Assert
            CollectionAssert.AreEqual(_expectedPatientsOrdered, actualPatients);
        }

        [Test]
        public async Task GetAll_ShouldReturnEmptyList_WhenNoPatientsExist()
        {
            // Arrange
            MockFindAsyncToReturnValue(Array.Empty<PatientDto>());

            // Act
            var actualPatients = await _patientService.GetAll();

            // Assert
            Assert.IsEmpty(actualPatients);
        }

        [Test]
        public void CreatePatients_ShouldThrowException_WhenFileHasNoPatients()
        {
            // Arrange
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(x => x.OpenReadStream()).Returns(new MemoryStream());
            _csvReaderMock.Setup(x => x.ReadPatientsData(fileMock.Object)).Returns(new List<PatientDto>());

            // Act & Assert
            Assert.ThrowsAsync<Exception>(() => _patientService.CreatePatients(fileMock.Object));
        }

        [Test]
        public async Task CreatePatients_SavesSuccessfully_WhenFileHasPatients()
        {
            // Arrange
            var fileContent = new[] { "First Name,Last Name,Birthday,Gender", "Clark,Kent,1984-02-29,M", "Diana,Prince,1976-03-22,F" };
            MockFileWithContent(fileContent);
            _csvReaderMock.Setup(x => x.ReadPatientsData(_mockFormFile.Object)).Returns(_expectedPatients);

            // Act
            await _patientService.CreatePatients(_mockFormFile.Object);

            // Assert
            Assert.DoesNotThrowAsync(() => _patientService.CreatePatients(_mockFormFile.Object));
        }

        [Test]
        public async Task Get_ShouldReturnPatient()
        {
            // Arrange
            MockFindAsyncToReturnValue(_expectedPatients);

            // Act
            PatientDto patient = await _patientService.Get("0");

            // Assert
            Assert.That(patient, Is.Not.Null);
        }

        [Test]
        public async Task Get_ShouldNotReturnPatient_WhenNoPatientsSaved()
        {
            // Arrange
            MockFindAsyncToReturnValue(Array.Empty<PatientDto>());

            // Act
            PatientDto patient = await _patientService.Get("0");

            // Assert
            Assert.That(patient, Is.Null);
        }

        private void MockFindAsyncToReturnValue(IEnumerable<PatientDto> value)
        {
            var mockCursor = new Mock<IAsyncCursor<PatientDto>>();
            mockCursor.Setup(_ => _.Current).Returns(value);
            mockCursor
                .SetupSequence(_ => _.MoveNext(It.IsAny<CancellationToken>()))
                .Returns(true)
                .Returns(false);
            mockCursor
                .SetupSequence(_ => _.MoveNextAsync(It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(true))
                .Returns(Task.FromResult(false));

            _patientsCollectionMock
                .Setup(_ => _.FindAsync(
                    It.IsAny<FilterDefinition<PatientDto>>(), 
                    It.IsAny<FindOptions<PatientDto, PatientDto>>(), 
                    It.IsAny<CancellationToken>()
                ))
                .ReturnsAsync(mockCursor.Object);
        }

        private void MockFileWithContent(IEnumerable<string> fileContent)
        {
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            foreach (var s in fileContent)
            {
                writer.WriteLine(s);
            }
            writer.Flush();
            stream.Position = 0;
            _mockFormFile.Setup(f => f.OpenReadStream()).Returns(stream);
            _mockFormFile.Setup(f => f.Length).Returns(stream.Length);
        }
    }
}