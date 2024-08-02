using SoftwareProject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SoftwareProject.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using SoftwareProject.Service;
using System.Text;



namespace SoftwareProject.Controllers
{
[Route("api/[controller]")]
[ApiController]
 public class AccountController : ControllerBase{
    // {
    //     private readonly UserManager<IdentityUser> _userManager;
    //     private readonly SignInManager<IdentityUser> _signInManager;
    //     private readonly EmailService _emailService;
    //     private readonly IConfiguration _configuration;

    //     private readonly ApplicationDbContext _context;

        private readonly AccountService _accountService;
        private readonly ILogger<AccountController> _logger;

   

        public AccountController(ILogger<AccountController> logger,  AccountService accountService)
        {
            
            _logger=logger;
            _accountService=accountService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(AuthModel model){


            var scheme = Request.Scheme;
            var host = Request.Host.Value;
            var(result,message,userID,token)= await _accountService. RegisterNewUser(model,scheme,host);
            if(result){
                return Ok(new{result,message,userID,token});
            }
            else{
                return BadRequest(new{message});
            }
        }
       
      


        // Add an action to handle email verification
        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
            {
                _logger.LogErrorWithMethod("Invalid userId or token used during email verification process");
                return BadRequest("Invalid verification request. Please check provided data");
            }
            var (result,message) = await _accountService.VerifyTheEmail(userId,token);
            if(result){
                return Ok(new{result,message});
            }
            else{
                return BadRequest(new{result,message});
            }

            
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {

            var (result,message)= await _accountService.LoginToAccount(model);
            if (result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var (result,message)=await _accountService.LogoutOfUser();
            if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
        }



        // private string GetCustomerIdentityId(IdentityUser user){
        //         try{

        //     var consumer= _context.Consumers
        //     .Include(c => c.IdentityUser) // Ensure related IdentityUser is loaded
        //     .FirstOrDefault(c => c.IdentityUserId == user.Id);
        //             if(consumer!=null){
        //                 return consumer.ConsumerId.ToString();
        //             }
        //              else
        //             {
        //                 return null;
        //             }

        //         }
        //         catch (Exception ex){

        //             _logger.LogErrorWithMethod($"Error retrieving customer ID for user : {ex.Message}");
        //             return null;
        //         }

        // // }
        // private string GenerateJwtToken(IdentityUser user, IList<string> roles,string customerId)
        // {
        //     var claims = new List<Claim>
        //     {
        //         new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        //         new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
             
        //     };

            // Add roles as claims
        //     foreach (var role in roles)
        //     {
        //         claims.Add(new Claim(ClaimTypes.Role, role));
        //     }

        //     var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        //     var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        //     var expires = DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"]));

        //     var token = new JwtSecurityToken(
        //         _configuration["Jwt:Issuer"],
        //         _configuration["Jwt:Issuer"],
        //         claims,
        //         expires: expires,
        //         signingCredentials: creds
        //     );

        //     return new JwtSecurityTokenHandler().WriteToken(token);
        // }

    }

  
}
