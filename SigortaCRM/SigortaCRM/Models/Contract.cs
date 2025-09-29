using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SigortaCRM.Models
{
    public enum ContractType
    {
        BES,
        FerdiKaza,
        Hayat,
        Saglik
    }

    public class Contract
    {
        public int Id { get; set; }
        public ContractType Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? CustomerId { get; set; }
        [JsonIgnore]
        public Customer? Customer { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
} 