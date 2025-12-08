// Models/LoginRequest.cs
using System.ComponentModel.DataAnnotations;

namespace DemoDockerApp.Models
{
    public class LoginRequest
    {
        [Required]
        public string Identifier { get; set; } = ""; // username or email

        [Required]
        public string Password { get; set; } = "";
    }
}
