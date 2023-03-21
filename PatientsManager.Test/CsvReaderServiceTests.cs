using Microsoft.AspNetCore.Http;
using Moq;
using PatientsManager.Models;
using PatientsManager.Services.Implementation;

namespace PatientsManager.Test
{
    [TestFixture]
    public class CsvReaderServiceTests
    {
        private CsvReaderService _csvReaderService;
        private Mock<IFormFile> _mockFormFile;

        [SetUp]
        public void Setup()
        {
            _csvReaderService = new CsvReaderService();
            _mockFormFile = new Mock<IFormFile>();
        }

        [Test]
        [TestCase(new object?[]{new []{"First Name,Last Name,Birthday,Gender","Clark,Kent,1984-02-29,M"}})]
        [TestCase(new object?[]{new []{"First Name,Last Name,Birthday,Gender","Clark,Kent,1984-02-29,M","Diana,Prince,1976-03-22,F"}})]
        public void ReadPatientsData_WithValidCsvFile_ReturnsListOfPatients(string[] testFileContent)
        {
            // Arrange
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            foreach (var s in testFileContent)
            {
                writer.WriteLine(s);
            }
            writer.Flush();
            stream.Position = 0;
            _mockFormFile.Setup(f => f.OpenReadStream()).Returns(stream);
            _mockFormFile.Setup(f => f.Length).Returns(stream.Length);

            // Act
            var result = _csvReaderService.ReadPatientsData(_mockFormFile.Object);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result, Is.InstanceOf(typeof(List<PatientDto>)));
            Assert.That(result, Is.Not.Empty);
        }

        [Test]
        public void ReadPatientsData_WithEmptyCsvFile_ReturnsEmptyCollection()
        {
            // Arrange
            _mockFormFile.Setup(f => f.OpenReadStream()).Returns(new MemoryStream());

            // Act
            var result = _csvReaderService.ReadPatientsData(_mockFormFile.Object);

            // Assert
            Assert.That(result, Is.Empty);
        }
    }
}