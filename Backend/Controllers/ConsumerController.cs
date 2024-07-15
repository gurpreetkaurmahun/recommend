using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject.Helpers;
using SoftwareProject;
using SoftwareProject.Models;

using Microsoft.AspNetCore.Identity;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsumerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ConsumerController> _logger; 
        private readonly UserManager<IdentityUser> _userManager;

        public ConsumerController(ApplicationDbContext context,ILogger<ConsumerController> logger,  UserManager<IdentityUser> userManager)
        {
            _context = context;
            _logger=logger;
            _userManager=userManager;
        }

        // GET: api/Consumer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Consumer>>> GetConsumers()
        {

            try{

                _logger.LogInformationWithMethod($"Fetching Customers===>");
                var customers=await _context.Consumers.ToListAsync();
                _logger.LogInformationWithMethod("Sucessfully retreived Customers");

                return Ok(customers);

            }catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to retrieve Customers:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");

            }
            
        }

        // GET: api/Consumer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Consumer>> GetConsumer(int id)
        {

            try{

                if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }

                _logger.LogInformationWithMethod($"Retreiving Details of COnsumer with id: {id}");
                var consumer = await _context.Consumers.FindAsync(id);

                if (consumer == null)
                {

                    _logger.LogErrorWithMethod($"Error:Recheck Customer with id{consumer.ConsumerId} not Found");
                    return NotFound();
                }

                _logger.LogInformationWithMethod($"Customer with Id:{consumer.ConsumerId} retrieved sucessfully!");
                return consumer;
            }
            catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to rereive Customer with id: {id}");
                return StatusCode(500,$"Failed with error:{ex}");

            }
           

           
        }

        // PUT: api/Consumer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsumer(int id, Consumer consumer)
        {

           try
            {

                if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }
                if (id != consumer.ConsumerId)
                {
                    _logger.LogErrorWithMethod($"Error:Please check the id");
                    return BadRequest();
                }


                _logger.LogInformationWithMethod($"Saving Details of the customer:===>");
                _context.Entry(consumer).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(new { message = $"Changes made to  Consumer with ConsumerId {consumer.ConsumerId}" });
            }



            catch (DbUpdateConcurrencyException ex)
            {
                if (!ConsumerExists(id))
                {

                    _logger.LogErrorWithMethod($"Invalid request as Customer with id: {id} does not exists");
                    return StatusCode(500, $"Failed with error: {ex}");
                }
                 _logger.LogErrorWithMethod($"Failed with error:{ex}");
                  return StatusCode(500,$"Failed with error:{ex}");

               
            }


            catch(Exception ex){
                  _logger.LogErrorWithMethod($"Failed with error:{ex}");
                  return StatusCode(500,$"Failed with error:{ex}");
            }
        }

        // POST: api/Consumer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Consumer>> PostConsumer(Consumer consumer)
        {

            try{

                 if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }
                //check fo rit in account registration
                // var existingUser=await _userManager.FindByEmailAsync(consumer.IdentityUser.Email);

                // if (existingUser!=null){
                //     _logger.LogErrorWithMethod($"User with Email:{existingUser.Email}, Use a different Email id");
                //      return BadRequest();
                    
                // }

                 //check for email as wee as well in Identity user.
                var existingCustomer = await _context.Consumers.FindAsync(consumer.ConsumerId);

                if (existingCustomer!=null){
                _logger.LogErrorWithMethod($"Invalid request: Customer with id:{consumer.ConsumerId} already exists in the system");
                 return BadRequest();
                }

                _logger.LogInformationWithMethod($"Adding new Customer with id:{consumer.ConsumerId} to the system");
                _context.Consumers.Add(consumer);
                await _context.SaveChangesAsync();

                 _logger.LogInformationWithMethod($" Customer with id:{consumer.ConsumerId} added to the system");

                return CreatedAtAction("GetConsumer", new { id = consumer.ConsumerId }, consumer);
            }
            catch( Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex}");
                  return StatusCode(500,$"Failed with error:{ex}");

            }
           
        }





        // DELETE: api/Consumer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsumer(int id)
        {

            try{
                if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }

                _logger.LogInformationWithMethod($"Checking for Consumer with id:{id}");
                var consumer = await _context.Consumers.FindAsync(id);
                if (consumer == null)
                {

                    _logger.LogErrorWithMethod($"Error:Customer with id: {id} not found, Please check the id");
                    return NotFound();
                }

                _logger.LogInformationWithMethod($"Removing Customer with id:{id} from the system");
                _context.Consumers.Remove(consumer);
                await _context.SaveChangesAsync();
                _logger.LogInformationWithMethod($" Customer with id:{id} removed from the system");
            }
            catch(Exception ex){
                  _logger.LogErrorWithMethod($"Failed with error:{ex}");
                  return StatusCode(500,$"Failed with error:{ex}");

            }
          

            return NoContent();
        }

        private bool ConsumerExists(int id)
        {
            return _context.Consumers.Any(e => e.ConsumerId == id);
        }
    }
}
