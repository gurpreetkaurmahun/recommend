
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftwareProject.Models;
using Microsoft.AspNetCore.Identity;
using SoftwareProject.Service;


namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsLetterSubscriptionsController : ControllerBase
    { private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly NewsLetterSubscriptionService _newsLetterSubscriptionService;

        public NewsLetterSubscriptionsController(ApplicationDbContext context,EmailService emailService, UserManager<IdentityUser> userManager,NewsLetterSubscriptionService newsLetterSubscriptionService)
        {
            _context = context;
            _emailService=emailService;
            _userManager=userManager;
            _newsLetterSubscriptionService=newsLetterSubscriptionService;
        }

        // GET: api/NewsLetterSubscriptions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsLetterSubscription>>> GetNewsLetterSubscriptions()
        {
            var (result,message)=await _newsLetterSubscriptionService.GetAllNewsLetters();

            if (result!=null){
                // _logger.LogInformationWithMethod(message);
                return Ok(new{result,message});
            }
            else{
                 return BadRequest(message);
            }

        }

        // GET: api/NewsLetterSubscriptions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NewsLetterSubscription>> GetNewsLetterSubscription(int id)
        {
           var (result,message)=await _newsLetterSubscriptionService.GetNewsLetterById(id);

            if(result!=null){
                // _logger.LogInformationWithMethod(message);

                return Ok(new{result,message});
            }
            else{
                return BadRequest(message);
            }
        }

        // PUT: api/NewsLetterSubscriptions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNewsLetterSubscription(int id, NewsLetterSubscription newsLetterSubscription)
        {
            var (result,message)=await _newsLetterSubscriptionService.updateNewsletter(id,newsLetterSubscription);
             if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
           }
        }

        // POST: api/NewsLetterSubscriptions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NewsLetterSubscription>> PostNewsLetterSubscription(NewsLetterSubscription newsLetterSubscription)
        {
           var (result,message)=await _newsLetterSubscriptionService.addNewsletter(newsLetterSubscription);
            if(result!=null){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
        }

        [HttpPost("send/{id}")]
       
        public async Task<IActionResult> SendNewsletter(int id, [FromBody] string email){

            var(result,message)= await _newsLetterSubscriptionService.SendNewsletter(id,email);
            if (result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
        }


        // DELETE: api/NewsLetterSubscriptions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNewsLetterSubscription(int id)
        {
            var (result,message)=await _newsLetterSubscriptionService.deleteNewsletter(id);
            if (result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }

        }

    }
}
