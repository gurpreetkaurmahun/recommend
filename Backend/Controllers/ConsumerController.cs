
using Microsoft.AspNetCore.Mvc;
using SoftwareProject.Helpers;
using SoftwareProject.Service;
using SoftwareProject.Models;
using Microsoft.AspNetCore.Identity;


namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsumerController : ControllerBase
    {
        private readonly ILogger<ConsumerController> _logger; 
        private readonly ConsumerService _consumerService;

        public ConsumerController(ILogger<ConsumerController> logger,ConsumerService consumerService)
        {
           
            _logger=logger;
         
            _consumerService=consumerService;
        }

        // GET: api/Consumer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Consumer>>> GetConsumers()
        {

            var (allConsumers,message) = await _consumerService.GetConsumersAsync();
            if(allConsumers!=null){
                _logger.LogInformationWithMethod(message);
                return Ok(new{allConsumers,message});
            }
            else{
                return BadRequest(message);
            }
        }

        // GET: api/Consumer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Consumer>> GetConsumer(int id)
        {
            var(consumer,message) = await _consumerService.GetConsumerAsync(id);

            if(consumer!=null){
                _logger.LogInformationWithMethod(message);

                return Ok(new{consumer,message});
            }
            else{
                return BadRequest(message);
            }
        }

        // PUT: api/Consumer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsumer(int id, Consumer consumer)
        {
            var (result,message) = await _consumerService.UpdateConsumer(id,consumer);
            if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
           }
        }

        // POST: api/Consumer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Consumer>> PostConsumer(Consumer consumer)
        {
            var (newConsumer,message) = await _consumerService.AddNewConsumer(consumer);
            if(newConsumer!=null){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
           
        }

        // DELETE: api/Consumer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsumer(int id)
        {
            var(result,message)= await _consumerService.DeleteConsumerById(id);

            if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(message);
            }
        }

        
    }
}


