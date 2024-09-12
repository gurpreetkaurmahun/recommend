using SoftwareProject.Models;
using Microsoft.AspNetCore.Identity;
using SoftwareProject.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace  SoftwareProject.Service{

    public class AccountService{

        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AccountService> _logger;
        public AccountService(ApplicationDbContext context, ILogger<AccountService> logger,UserManager<IdentityUser> userManager,SignInManager<IdentityUser> signInManager, EmailService emailService, IConfiguration configuration){

            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _configuration = configuration;
            _context=context;
            _logger=logger;
            
        }

        public async Task<(bool result,string message,string userId,string token)> RegisterNewUser( AuthModel model, string scheme, string host)
        {
            if(!ValidationHelper.Validpassword(model.Password))
            {
            _logger.LogErrorWithMethod("Invalid Password entered");
            return (false,"Invalid password. Please ensure your password contains at least 8 characters " +
                              "and contains at least one lower-case, upper-case, digit and symbol.",null,null);
            }

            if(!ValidationHelper.IsValidUsername(model.FName))
            {
                _logger.LogErrorWithMethod("Invalid Name entered");

                return (false,"Invalid name entered:Make sure first name is less than 25 characters and doesnot contain any special characters",null,null);
            }

            if(!ValidationHelper.IsValidUsername(model.LName))
            {
                _logger.LogErrorWithMethod("Invalid Name entered");

                return (false,"Invalid name entered:Make sure first name is less than 25 characters and doesnot contain any special characters",null,null);
            }

            var user = new IdentityUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                _logger.LogInformationWithMethod("Creating an instance of user Details and Location");
                var consumer=new Consumer{
                FName=model.FName,
                LName=model.LName,
                Address=model.Address, 
                ContactNo=model.ContactNo,
                IdentityUserId =user.Id,
                Dob=model.Dob
                };

                _logger.LogInformationWithMethod("Saving user Location to database");

                _logger.LogInformationWithMethod("Saving Consumer details to database");
                _context.Consumers.Add(consumer);

               try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                   
                    return (false,$"Error Saving User Details: {ex.Message}",null,null);
                }

                // Generate an email verification token
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                // Create the verification link
                var verificationLink = $"{scheme}://{host}/api/Account/verify-email?userId={user.Id}&token={Uri.EscapeDataString(token)}";

                // Send the verification email
                var emailSubject = $"Recommend app Welcomes {model.FName}!";
                var emailBody = $"Please verify your email by clicking the following link: {verificationLink}";
                _emailService.SendEmail(user.Email, emailSubject, emailBody);
               
                return (true,"User registered successfully. An email verification link has been sent.",user.Id,token);
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    _logger.LogError($"Registration error: {error.Code} - {error.Description}");
                }
                return (false, $"Registration failed: {string.Join(", ", result.Errors.Select(e => e.Description))}",null,null);
            }

        }

        public async Task<(bool result,string message)> VerifyTheEmail(string userId, string token)
        {

            if(string.IsNullOrEmpty(userId))
            {
                _logger.LogErrorWithMethod("Invalid Attempt:UserId cannot be null");
                return (false,"Please make sure a valid userID is entered");
            }
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            { _logger.LogErrorWithMethod($"User with Id:{userId} not found");

                return (false,"User not found.");
            }
            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                _logger.LogInformationWithMethod("Email verification successfull");
                return (true,"Email verification successful.");
            }

            _logger.LogErrorWithMethod($"Email verification failed:{result.Errors}");
            return (false,"Email verification failed.");

        }


        public async Task<(bool result,object message)> LoginToAccount(LoginModel model){
         
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                var roles = await _userManager.GetRolesAsync(user);
                string consumerId= GetCustomerIdentityId(user);
                var token = GenerateJwtToken(user,roles,consumerId);

                _logger.LogInformationWithMethod("User Sucessfully login in");
                var loginResult = new
                {
                    Token = token,
                    ConsumerId = consumerId,
                    IdentityUserId = user.Id
                };
                return (true,loginResult);
            }
            _logger.LogErrorWithMethod("Invalid login attempt,Please try logging in again or registering for the app");
            return(false,"Invalid login attempt,Please try loggin in again or registring for the app");

        }

        public async Task<(bool result,string message)> LogoutOfUser()
        {
            try
            {
            await _signInManager.SignOutAsync();
            _logger.LogInformationWithMethod("User logger out");
            return (true,"Logged out");
            }
            catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"An error occured while logging out:{ex.Message}");
                return (false,$"Error Saving User Details: {ex.Message}");
            }
            
        }

        private string GetCustomerIdentityId(IdentityUser user)
        {
            try
            {
                var consumer= _context.Consumers
                .Include(c => c.IdentityUser) // Ensure related IdentityUser is loaded
                .FirstOrDefault(c => c.IdentityUserId == user.Id);

                if(consumer!=null)
                {
                    return consumer.ConsumerId.ToString();
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                _logger.LogErrorWithMethod($"Error retrieving customer ID for user : {ex.Message}");
                return null;
            }

        }
        private string GenerateJwtToken(IdentityUser user, IList<string> roles,string customerId)
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
            // var expires = DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"]));
             var expires = DateTime.UtcNow.AddMinutes(30); // Set token expiration to 30 minutes

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Issuer"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
    
}