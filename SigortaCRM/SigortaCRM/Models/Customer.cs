using System.Collections.Generic;

namespace SigortaCRM.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? TCKN { get; set; }
        public ContactInfo? ContactInfo { get; set; }
        public ICollection<Contract>? Contracts { get; set; }
    }
} 