using Microsoft.EntityFrameworkCore;
using SigortaCRM.Models;

namespace SigortaCRM.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<ContactInfo> ContactInfos { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Contract>()
                .HasOne(c => c.Customer)
                .WithMany(cu => cu.Contracts)
                .HasForeignKey(c => c.CustomerId)
                .IsRequired(false);
        }
    }
} 