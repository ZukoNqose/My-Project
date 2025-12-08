using Microsoft.AspNetCore.Identity;

namespace DemoDockerApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        // add extra profile fields here later, e.g.:
        // public string FirstName { get; set; }
             public DateTime Dob { get; set; }   
    }
}
