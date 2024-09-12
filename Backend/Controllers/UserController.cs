
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Identity;


namespace FinalYearProject.Controllers{

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
     private readonly ApplicationDbContext _context;
     private readonly ILogger<UserController> _logger;

    public UserController(UserManager<IdentityUser> userManager,ApplicationDbContext context,ILogger<UserController> logger)
    {
        _userManager = userManager;
        _context=context;
        _logger=logger;
    }

   [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogError("GetUser: User ID cannot be null or empty.");
                return BadRequest("User ID cannot be null or empty.");
            }

            try
            {
                // Find the IdentityUser
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning($"GetUser: User with ID {userId} not found.");
                    return NotFound("User not found.");
                }

                // Create a response object with just the ID and email
                var userInfo = new
                {
                    UserId = user.Id,
                    Email = user.Email
                };

                _logger.LogInformation($"GetUser: Successfully retrieved information for user {userId}");
                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetUser: Error retrieving user {userId}: {ex.Message}");
                return BadRequest($"Error retrieving user information: {ex.Message}");
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userManager.Users
                    .Select(u => new { UserId = u.Id, Email = u.Email })
                    .ToListAsync();

                _logger.LogInformation($"GetAllUsers: Successfully retrieved {users.Count} users");
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetAllUsers: Error retrieving users: {ex.Message}");
                return BadRequest($"Error retrieving user information: {ex.Message}");
            }
        }

    [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogError("DeleteUser: User ID cannot be null or empty.");
                return BadRequest("User ID cannot be null or empty.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning($"DeleteUser: User with ID {userId} not found.");
                return NotFound("User not found.");
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    _logger.LogInformation($"DeleteUser: Starting deletion process for user {userId}");

                    // Find and delete related Consumer record
                    var consumer = await _context.Consumers
                        .Include(c => c.Location) // Include Location if it's a navigation property
                        .FirstOrDefaultAsync(c => c.IdentityUserId == userId);

                    if (consumer != null)
                    {
                        _logger.LogInformation($"DeleteUser: Deleting Consumer record for user {userId}");
                        
                        // If Location is a separate entity, delete it
                        if (consumer.Location != null)
                        {
                            _logger.LogInformation($"DeleteUser: Deleting associated Location for user {userId}");
                            _context.Locations.Remove(consumer.Location);
                        }

                        _context.Consumers.Remove(consumer);
                    }

                    // Save changes to delete related records
                    await _context.SaveChangesAsync();

                    // Delete the user
                    _logger.LogInformation($"DeleteUser: Deleting IdentityUser {userId}");
                    var result = await _userManager.DeleteAsync(user);
                    if (!result.Succeeded)
                    {
                        throw new Exception($"Failed to delete user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }

                    await transaction.CommitAsync();
                    _logger.LogInformation($"DeleteUser: User {userId} and related data deleted successfully");
                    return Ok("User and related data deleted successfully.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError($"DeleteUser: Error deleting user {userId}: {ex.Message}");
                    return BadRequest($"Error deleting user: {ex.Message}");
                }
            }
}

    }

}

