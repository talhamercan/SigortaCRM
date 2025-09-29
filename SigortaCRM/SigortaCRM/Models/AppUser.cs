using System.ComponentModel.DataAnnotations;

namespace SigortaCRM.Models
{
    public class AppUser
    {
        public int Id { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public string Role { get; set; } // Kullanıcı rolü: Admin, User, vs.
        // İstersen ek alanlar: Ad, Soyad, Rol, vs.
    }
} 