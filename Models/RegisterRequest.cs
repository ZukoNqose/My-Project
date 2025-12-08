// Models/RegisterRequest.cs
using System.ComponentModel.DataAnnotations;

namespace DemoDockerApp.Models
{
    public class RegisterRequest
    {
        public string Username { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        public string Phone { get; set; } = "";

        // Accept as string from React date input ("yyyy-mm-dd")
        public string Dob { get; set; } = "";

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = "";

        [Required]
        public string ConfirmPassword { get; set; } = "";
    }
}
