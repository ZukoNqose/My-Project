// Controllers/AuthController.cs
using DemoDockerApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace DemoDockerApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            if (model == null)
                return BadRequest(new { message = "Request body is required." });

            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
                return BadRequest(new { message = "Email and Password are required." });

            if (model.Password != model.ConfirmPassword)
                return BadRequest(new { message = "Passwords do not match." });

            DateTime? dob = null;
            if (!string.IsNullOrWhiteSpace(model.Dob))
            {
                if (DateTime.TryParse(model.Dob, out var parsedDob))
                    dob = parsedDob;
                else
                    return BadRequest(new { message = "Invalid date of birth format." });
            }

            var existingByEmail = await _userManager.FindByEmailAsync(model.Email);
            if (existingByEmail != null)
                return BadRequest(new { message = "Email is already taken." });

            var user = new ApplicationUser
            {
                UserName = string.IsNullOrWhiteSpace(model.Username) ? model.Email : model.Username,
                Email = model.Email,
                PhoneNumber = string.IsNullOrWhiteSpace(model.Phone) ? null : model.Phone,
            };

            if (dob.HasValue)
            {
                var dobProp = typeof(ApplicationUser).GetProperty("Dob");
                if (dobProp != null && dobProp.CanWrite)
                    dobProp.SetValue(user, dob.Value);
            }

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToArray();
                return BadRequest(new { message = "Registration failed.", errors });
            }

            return Ok(new { message = "Registration successful!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            if (model == null)
                return BadRequest(new { message = "Request body is required." });

            if (string.IsNullOrWhiteSpace(model.Identifier) || string.IsNullOrWhiteSpace(model.Password))
                return BadRequest(new { message = "Identifier and Password are required." });

            var user = await _userManager.FindByEmailAsync(model.Identifier)
                       ?? await _userManager.FindByNameAsync(model.Identifier);

            if (user == null)
                return BadRequest(new { message = "Invalid username/email or password." });

            var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!passwordValid)
                return BadRequest(new { message = "Invalid username/email or password." });

            // Sign in the user (cookie-based auth)
            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok(new { message = "Login successful!" });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logged out successfully." });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userId = User?.Identity?.Name;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByNameAsync(userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                userName = user.UserName,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                dob = user.Dob
            });
        }
    }
}
