
using Microsoft.AspNetCore.Mvc;
using SoftwareProject.Models;
using SoftwareProject.Service;

namespace FinalYearProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ReviewService _reviewService;

        public ReviewsController(ApplicationDbContext context,ReviewService reviewService)
        {
            _context = context;
            _reviewService=reviewService;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            var (result, message) = await _reviewService.GetReviewsAsync();
            if (result == null)
            {
                return BadRequest(message);
            }
            else
            {
                return Ok(new { Reviews = result, Message = message });
            }
            
        }

        // GET: api/Reviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            var (result,message)=await _reviewService.GetReviewsByIdAsync(id);
            if(result!=null){
              return Ok(new{result,message});
            }
            else{
                return BadRequest(message);
            }
        }

        // PUT: api/Reviews/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, Review review)
        {
            var (result,message)=await _reviewService.UpdateReviewsAsync(id,review);
            if(result){
                return Ok(new{message});
            }
            else{
                return BadRequest(new{message});
            }
        }

        // POST: api/Reviews
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            var (result,message)= await _reviewService.PostReviewsAsync(review);
            if (result!=null)
            {
                return Ok(new{message});
            }
            else
            {
                return BadRequest(new{message});
            }
        }

        // DELETE: api/Reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var (result,message)=await _reviewService.DeleteReviewsAsync(id);
            if(result){
                return Ok(new{message});
            }
            else{
                return Ok(new{message});
            }
        }

    }
}
