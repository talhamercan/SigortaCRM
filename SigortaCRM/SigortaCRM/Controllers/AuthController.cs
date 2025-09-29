using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SigortaCRM.Data;
using SigortaCRM.Models;
using System.Linq;

namespace SigortaCRM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Kullanıcıyı veritabanında ara (şifre hash'siz, düz metin)
            var user = _context.AppUsers.FirstOrDefault(u => u.Email == request.Username && u.PasswordHash == request.Password);
            if (user != null)
            {
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, user.Email)
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("supersecretkey12345supersecretkey12345"));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    issuer: "SigortaCRM",
                    audience: "SigortaCRMUser",
                    claims: claims,
                    expires: DateTime.Now.AddHours(2),
                    signingCredentials: creds
                );
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
            }
            return Unauthorized();
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
} 