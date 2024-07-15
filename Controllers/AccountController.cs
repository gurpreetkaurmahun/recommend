using SoftwareProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using SoftwareProject.Helpers;

using SoftwareProject.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;


namespace SoftwareProject.Controllers
{
[Route("api/[controller]")]
[ApiController]
 public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;

        private readonly ApplicationDbContext _context;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, EmailService emailService, IConfiguration configuration,ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _configuration = configuration;
            _context=context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(AuthModel model)
        {
            var user = new IdentityUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {

                        var location=new Location{
                        Longitude = model.Longitude,
                        Latitude = model.Latitude,
                        FullLocation = model.FullLocation

                    };

                    var consumer=new Consumer{
                        FName=model.FName,
                        LName=model.LName,
                        Address=model.Address, 
                        ContactNo=model.ContactNo,
                        IdentityUserId =user.Id,
                        Dob=model.Dob,
                        Location=location

                        };

                _context.Locations.Add(location);
        
                _context.Consumers.Add(consumer);
              try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    // Log the exception
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }

                // Generate an email verification token
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                // Create the verification link
                var verificationLink = Url.Action("VerifyEmail", "Account", new { userId = user.Id, token = token }, Request.Scheme);

                // Send the verification email
                var emailSubject = "Email Verification";
                var emailBody = $"Please verify your email by clicking the following link: {verificationLink}";
                _emailService.SendEmail(user.Email, emailSubject, emailBody);
               
                return Ok("User registered successfully. An email verification link has been sent.");
            }

            return BadRequest(result.Errors);
        }


        // Add an action to handle email verification
        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (result.Succeeded)
            {
                return Ok("Email verification successful.");
            }

            return BadRequest("Email verification failed.");
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                var roles = await _userManager.GetRolesAsync(user);
                var token = GenerateJwtToken(user,roles);
                return Ok(new { Token = token });
            }

            return Unauthorized("Invalid login attempt.");
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok("Logged out");
        }
        private string GenerateJwtToken(IdentityUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            // Add roles as claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"]));

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Issuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }

  
}
