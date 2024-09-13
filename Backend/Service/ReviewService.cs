using SoftwareProject.Models;
using Microsoft.AspNetCore.Identity;
using SoftwareProject.Helpers;
using Microsoft.EntityFrameworkCore;

namespace  SoftwareProject.Service{

    public class ReviewService{

        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReviewService> _logger;
        private readonly UserManager<IdentityUser> _userManager;

        public ReviewService(ApplicationDbContext context,ILogger<ReviewService> logger,UserManager<IdentityUser> userManager)
        {
            _context=context;
            _logger=logger;
            _userManager=userManager;
        }

        public async Task<(List<Review> reviews, string message)> GetReviewsAsync()
        {
            try
            {
                var allReviews = await _context.Reviews.ToListAsync();
                var consumerIds = allReviews.Select(r => r.ConsumerId).Distinct().ToList();
                var consumers = await _context.Consumers
                .Where(c => consumerIds.Contains(c.ConsumerId))
                .ToDictionaryAsync(c => c.ConsumerId, c => c);

                var reviewsWithConsumerNames = allReviews.Select(r => new Review
                {
                    ReviewId = r.ReviewId,
                    review = r.review,
                    reviewDate = r.reviewDate,
                    stars = r.stars,
                    ConsumerId = r.ConsumerId,
                    UserEmail = r.UserEmail,
                    ConsumerName = r.ConsumerName
                }).ToList();

                _logger.LogInformation($"Successfully retrieved {reviewsWithConsumerNames.Count} reviews with consumer names.");
                return (reviewsWithConsumerNames, "Successfully retrieved reviews with consumer names.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to retrieve reviews with error: {ex.Message}");
                return (null, $"Failed to retrieve reviews with error: {ex.Message}");
            }

        } 

        public async Task<(Review review, string message)> GetReviewsByIdAsync(int id)
        {
            try{
                _logger.LogInformationWithMethod($"Retreiving Details of review with id: {id}");
                var review = await _context.Reviews.FindAsync(id);

            if (review == null)
            {
                _logger.LogErrorWithMethod($"Failed to retrieve review with id {id})");
                return (null,$"Failed to retreive review with id: {id}");
            }
                _logger.LogInformationWithMethod($"Review with Id:{review.ReviewId} retrieved sucessfully!");
                return (review,$"Sucessfully retreived Consumer with id : {id}");
            }

            catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"Failed to retreive review with id: {id}, Exception message:{ex.Message}");
                return (null,$"Failed with error:{ex}");

            }

        }

        public async Task<(Review review, string message)> PostReviewsAsync( Review review)
        {
            try
            {
                var existingReview = await _context.Reviews.FindAsync(review.ReviewId);

                if (existingReview!=null)
                {
                _logger.LogErrorWithMethod($"Invalid request: Customer with id:{review.ReviewId} already exists in the system");
                return (null,$"Invalid request: Customer with id:{review.ReviewId} already exists in the system");
                }

                var consumer = await _context.Consumers.FindAsync(review.ConsumerId);
                if (consumer == null)
                {
                    _logger.LogErrorWithMethod($"Invalid request: Consumer with id:{review.ConsumerId} not found");
                    return (null, $"Invalid request: Consumer with id:{review.ConsumerId} not found");
                }

                _context.Reviews.Add(review);

                if (consumer.Reviews == null)
                {
                    consumer.Reviews = new List<Review>();
                }
                consumer.Reviews.Add(review);
                

                await _context.SaveChangesAsync();
                _logger.LogInformationWithMethod($" Review with id:{review.ReviewId} added to the system");

                return (review,$" Review with id:{review.ReviewId} added to the system");

                }
                catch(Exception ex)
                {
                _logger.LogErrorWithMethod($"Add request failed due to internal server error{ex.Message}");
                return (null,"Add request failed due to internal server error");
                }

        }


        public async Task<(bool result, string message)> UpdateReviewsAsync( int id, Review review)
        {
            try
            {
                if (id != review.ReviewId)
                {
                    _logger.LogErrorWithMethod($"Invalid request as provided id does not match with ReviewId");
                        return (false,"Invalid request as provided id does not match with ReviewId");
                }

                _logger.LogInformationWithMethod($"Saving Details of the Review:===>");
                _context.Entry(review).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return (true, $"Changes made to  Consumer with ConsumerId {review.ReviewId}" );
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!ReviewExists(id))
                {
                    _logger.LogErrorWithMethod($"Review does not exist in the database. Error message: {ex.Message}");
                    return (false,$"Review does not exist in the database. Error message: {ex.Message}");
                }
                _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                return (false, "Update request failed due to some internal error. Try again.");
            }

            catch(Exception ex){
            _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
            return (false,"Update request failed due to some internal error. Try again.");
            }
        }

        public async Task<(bool result, string message)> DeleteReviewsAsync(int id)
        {
            try
            {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                _logger.LogErrorWithMethod($"Error:Review with id: {id} not found, Please check the id");
                return (false,$"Error:Review with id: {id} not found, Please check the id");
            }
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            _logger.LogInformationWithMethod($" Review with id:{id} sucessfully deleted");
            return (true,$" Review with id:{id} sucessfully deleted");
            }
            catch(Exception ex)
            {
                _logger.LogErrorWithMethod($"Delete request failed due to internal server error{ex.Message}");
                return (false,"Delete request failed due to internal server error");
            }

        }
        private bool ReviewExists(int id)
        {
            return _context.Reviews.Any(e => e.ReviewId == id);
        }


    }
}