using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using PatientsManager.Models.Enums;
using CsvHelper.Configuration.Attributes;

namespace PatientsManager.Models
{
    public class PatientDTO
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
         public string Id { get; set; }

         [BsonRepresentation(BsonType.String)]
         [Required(AllowEmptyStrings = false, ErrorMessage = "Patient's first name shouldn't be empty")]
         [Name("First Name")]
         public string FirstName { get; set; }

         [BsonRepresentation(BsonType.String)]
         [Required(AllowEmptyStrings = false, ErrorMessage = "Patient's last name shouldn't be empty")]
         [Name("Last Name")]
         public string LastName { get; set; }

         [BsonRepresentation(BsonType.DateTime)]
         [Required(AllowEmptyStrings = false, ErrorMessage = "Patient's birthday shouldn't be empty")]
         [Name("Birthday")]
         public DateTime Birthday { get; set; }

         [BsonRepresentation(BsonType.String)]
         [Name("Gender")]
         public GenderEnum Gender { get; set; }

         [BsonRepresentation(BsonType.DateTime)]
         public DateTime? Created { get; set; }

         [BsonRepresentation(BsonType.DateTime)]
         public DateTime? Updated { get; set; }
    }
}