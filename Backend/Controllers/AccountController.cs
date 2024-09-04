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
using Microsoft.AspNetCore.Authorization;



namespace SoftwareProject.Controllers
{
[Route("api/[controller]")]
[ApiController]


 public class AccountController : ControllerBase{
   

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


    }

  
}
