using System.Text.Json.Serialization;

namespace SigortaCRM.Models
{
    public class ContactInfo
    {
        public int Id { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public int CustomerId { get; set; }
        [JsonIgnore]
        public Customer? Customer { get; set; }
    }
} 