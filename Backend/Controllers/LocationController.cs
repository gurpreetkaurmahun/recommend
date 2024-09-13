using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject.Models;
using SoftwareProject.Helpers;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LocationController> _logger; 

        public LocationController(ApplicationDbContext context,ILogger<LocationController> logger)
        {
            _context = context;
            _logger=logger;
        }

        // GET: api/Location
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
        {

            try{

                _logger.LogInformationWithMethod($"Fetching Locations===>");
                var Locations=await _context.Locations.ToListAsync();
                _logger.LogInformationWithMethod("Sucessfully retreived Locations");

                return Ok(Locations);

            }catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to retrieve Locations:{ex.Message}");

                return StatusCode(500,$"Failed with error:{ex.Message}");

            }

    }

        // GET: api/Location/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Location>> GetLocation(int id)
        {

            try{
                if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }

                _logger.LogInformationWithMethod($"Retreiving details of location with id:{id}");
                var location = await _context.Locations.FindAsync(id);

            if (location == null)
            {

                _logger.LogErrorWithMethod($"Invalid Request:Location with id: Not Found");
                return NotFound();
            }

            _logger.LogInformationWithMethod($"Location with Id:{location.LocationId} retrieved sucessfully!");
            return Ok(location);


            }
            catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed to reteive Location with id: {id}");
                return StatusCode(500,$"Failed with error:{ex}");


            }
            
        }

        // PUT: api/Location/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLocation(int id, Location location)
        {
           

            try
            {

            if (id != location.LocationId)
            {

                _logger.LogErrorWithMethod($"Invalid Id, Please recheck the id as  ids DO not match");
                return BadRequest();
            }

            _context.Entry(location).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformationWithMethod($"Location with id:{id} updated sucessfully");
              return Ok(new { message = $"Changes made to  Location with LocationId {location.LocationId}" });
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!LocationExists(id))
                {
                    _logger.LogErrorWithMethod($"Location with id:{id} not found");
                    return NotFound();
                }

                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                  return StatusCode(500,$"Failed with error:{ex.Message}");
                
               
            }

            catch(Exception ex){
                 _logger.LogErrorWithMethod($"Failed with error:{ex}");
                  return StatusCode(500,$"Failed with error:{ex}");
            }

           
        }

        // POST: api/Location
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Location>> PostLocation(Location location,int consumerId)
        {

            try{

            if (!ModelState.IsValid)
                {
                    _logger.LogErrorWithMethod($"Invalid request");
                    return BadRequest(ModelState);
                }

            var existingCustomer= await _context.Consumers.FindAsync(consumerId);

            if(existingCustomer==null){
                _logger.LogErrorWithMethod($"Customer with id: {consumerId} not found");
                return NotFound($"Customer with id: {consumerId} not found");
            }

           


            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            existingCustomer.LocationId=location.LocationId;
            existingCustomer.Location=location;
             await _context.SaveChangesAsync();
            _logger.LogInformationWithMethod($"Location added Suceesfully ot the system");
            return CreatedAtAction("GetLocation", new { id = location.LocationId }, location);

            }

            catch(Exception ex){

                _logger.LogErrorWithMethod($"Failed to create Location with given information");
                return StatusCode(500,$"Failed with error:{ex}");

            }
           
        }

        // DELETE: api/Location/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {

            try{

            _logger.LogInformationWithMethod($"Finding Location with id:{id} from the system");
            var location = await _context.Locations.FindAsync(id);

            if (location == null)
            {
                _logger.LogErrorWithMethod($"Location with id: {id} not found in the system");
                return NotFound();
            }

            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();
            _logger.LogInformationWithMethod($"Location with id:{id} deleted from the system");

            }

            catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to delete Location with given information");
                return StatusCode(500,$"Failed with error:{ex}");
            }
          

            return NoContent();
        }

        private bool LocationExists(int id)
        {
            return _context.Locations.Any(e => e.LocationId == id);
        }
    }
}
