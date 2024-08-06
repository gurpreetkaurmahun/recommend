using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SoftwareProject.Models;

using SoftwareProject.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace SoftwareProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger<RolesController> _logger; 

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager,ILogger<RolesController> logger)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _logger=logger;
        }

        [HttpGet]
        public IActionResult GetRoles()
        {

            try{
                _logger.LogInformationWithMethod("CHecking The system for Roles");
                var roles = _roleManager.Roles.ToList();
                return Ok(roles);
            }
            catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to retreive roles, Error:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");
            }
        }

        [HttpGet("{roleId}")]
        public async Task<IActionResult> GetRole(string roleId)
        {

            try{

                _logger.LogInformationWithMethod($"Checking the system for role with is{roleId}");
                var role = await _roleManager.FindByIdAsync(roleId);

                if (role == null)
                {
                    _logger.LogErrorWithMethod($"Failed to retreive role with id:{roleId}");
                    return NotFound("Role not found.");
                }

                return Ok(role);
            }catch(Exception ex){
                _logger.LogErrorWithMethod($"Error occured while retreiving  role with id:{roleId}, Error:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");
            }
            
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole( CreateRole rolename)
        {

            try{

            if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod("Invalid request");
                    return BadRequest(ModelState);
                }
            var role = new IdentityRole(rolename.RoleName);
            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                _logger.LogInformationWithMethod($"ROleName:{rolename} created successfully");
                return Ok("Role created successfully.");
            }
             _logger.LogErrorWithMethod($"Invalid request: {string.Join(", ", result.Errors)}");
                return BadRequest(result.Errors);
            }catch(Exception ex){
                _logger.LogErrorWithMethod($"Error occured while creating role, Error:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");


            
        }}

        [HttpPut]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleModel model)
        {


            try{
            
            _logger.LogInformationWithMethod($"CHecking the system for role with Id:{model.RoleId}");
            var role = await _roleManager.FindByIdAsync(model.RoleId);

            if (role == null)
            {

                _logger.LogErrorWithMethod($"Role with id:{model.RoleId}");
                return NotFound("Role not found.");
            }

            role.Name = model.NewRoleName;
            var result = await _roleManager.UpdateAsync(role);

            if (result.Succeeded)
            {

                _logger.LogInformationWithMethod($"Role with id:{model.RoleId} updated Sucessfully");
                return Ok("Role updated successfully.");
            }
            _logger.LogErrorWithMethod($"Invalid request: {string.Join(", ", result.Errors)}");
            return BadRequest(result.Errors);
            }catch(Exception ex){
                _logger.LogErrorWithMethod($"Error occured while updating role with {model.RoleId}, Error:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");

     
        }}

        [HttpDelete]
        public async Task<IActionResult> DeleteRole(string roleId)
        {

            try{
                 _logger.LogInformationWithMethod($"CHecking the system for role with Id:{roleId}");
                   var role = await _roleManager.FindByIdAsync(roleId);

            if (role == null)
            {
                 _logger.LogErrorWithMethod($"Role with id:{roleId}");
                return NotFound("Role not found.");
            }

            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded)
            {

                 _logger.LogInformationWithMethod($"Role with id:{roleId} deleted Sucessfully");
                return Ok("Role deleted successfully.");
            }


             _logger.LogErrorWithMethod($"Invalid request: {string.Join(", ", result.Errors)}");
            return BadRequest(result.Errors);
            }catch(Exception ex){
                _logger.LogErrorWithMethod($"Error occured while deleting role with {roleId}, Error:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");
         
        }}

        [HttpPost("assign-role-to-user")]
        public async Task<IActionResult> AssignRoleToUser([FromBody] AssignRoleModel model)
        {

            try{

            if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod("Error. Invalid request.");
                    return BadRequest(ModelState);
                }
            
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user == null)
            {
                _logger.LogErrorWithMethod($"Role with id:{model.UserId}");
                return NotFound("User not found.");
            }

            var roleExists = await _roleManager.RoleExistsAsync(model.RoleName);

            if (!roleExists)
            {
                 _logger.LogErrorWithMethod($"Role with name:{model.RoleName} not found");
                return NotFound("Role not found.");
            }

            var result = await _userManager.AddToRoleAsync(user, model.RoleName);

            if (result.Succeeded)
            {
                 _logger.LogInformationWithMethod($"Role assigned to user  Sucessfully");
                return Ok("Role assigned to user successfully.");
            }
             _logger.LogErrorWithMethod($"Invalid request: {string.Join(", ", result.Errors)}");
            return BadRequest(result.Errors);
            }catch(Exception ex){
                _logger.LogErrorWithMethod($"Error occured while assigning role to user:{model.UserId}, Error:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");
         
        }
            
        }

    }
}

