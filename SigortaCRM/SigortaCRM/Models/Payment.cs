using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SigortaCRM.Models
{
    public enum PaymentStatus
    {
        Odendi,
        Beklemede,
        Gecikmis
    }

    public enum PaymentPeriod
    {
        Aylik,
        Yillik
    }

    public class Payment
    {
        public int Id { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public PaymentStatus Status { get; set; }
        public PaymentPeriod Period { get; set; }
        public int ContractId { get; set; }
        public Contract Contract { get; set; }
    }
} 