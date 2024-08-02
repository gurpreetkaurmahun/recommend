using SoftwareProject.Models;
using SoftwareProject.Helpers;
using Microsoft.EntityFrameworkCore;

namespace  SoftwareProject.Service{

    public class ConsumerService{

        private readonly ApplicationDbContext _context;
        private readonly ILogger<ConsumerService> _logger;

        public ConsumerService(ApplicationDbContext context, ILogger<ConsumerService> logger){

            _context=context;
            _logger=logger;
        }

        public async Task<(List<Consumer> consumers, string message)> GetConsumersAsync(){

            try{
                var allConsumers=await _context.Consumers.ToListAsync();
                _logger.LogInformationWithMethod("Sucessfully retreived Consumers");

                return (allConsumers,"Sucessfully retreived Consumers");
                
            }
            catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to retrieve Consumers:{ex.Message}");

                return (null,$"Failed to retreive Consumers");

            }

        }

        public async Task<(Consumer consumer,string message)> GetConsumerAsync(int id){

            try{

                 _logger.LogInformationWithMethod($"Retreiving Details of COnsumer with id: {id}");
                var consumer = await _context.Consumers.FindAsync(id);

                if (consumer == null)
                {

                    _logger.LogErrorWithMethod($"Failed to retrieve Consumer with id {id})");
                    return (null,$"Failed to retrieve Consumer with id {id})");
                }

                _logger.LogInformationWithMethod($"Customer with Id:{consumer.ConsumerId} retrieved sucessfully!");
                return (consumer,$"Sucessfully retreived Consumer with id : {id}");
            }
            catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed to rereive Customer with id: {id}, Exception message:{ex.Message}");
                
                return (null,$"Failed with error:{ex}");

            }
        }

        public async Task<(bool result,string message)> UpdateConsumer(int id, Consumer consumer){


            try
            {
                if (id != consumer.ConsumerId)
                {
                    _logger.LogErrorWithMethod($"Invalid request as provided id does not match with ProductId");
                    return (false,"Invalid request as provided id does not match with ProductId");
                }


                _logger.LogInformationWithMethod($"Saving Details of the customer:===>");
                _context.Entry(consumer).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return (true, $"Changes made to  Consumer with ConsumerId {consumer.ConsumerId}" );
            }



            catch (DbUpdateConcurrencyException ex)
            {
                if (!ConsumerExists(id))
                {

                    _logger.LogErrorWithMethod($"Product does not exist in the database. Error message: {ex.Message}");
                    return (false,$"Product does not exist in the database. Error message: {ex.Message}");
                }
                 _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                    return (false, "Update request failed due to some internal error. Try again.");

               
            }

                catch(Exception ex){
                _logger.LogErrorWithMethod($"Failed with error:{ex.Message}");
                return (false,"Update request failed due to some internal error. Try again.");
            }
        }

        public async Task<(Consumer consumer,string message)> AddNewConsumer(Consumer consumer){

                try{

            
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
                 return (null,$"Invalid request: Customer with id:{consumer.ConsumerId} already exists in the system");
                }

                _logger.LogInformationWithMethod($"Adding new Customer with id:{consumer.ConsumerId} to the system");
                _context.Consumers.Add(consumer);
                await _context.SaveChangesAsync();

                _logger.LogInformationWithMethod($" Customer with id:{consumer.ConsumerId} added to the system");

                return (consumer,$" Customer with id:{consumer.ConsumerId} added to the system");
                }
            catch( Exception ex){
                  _logger.LogErrorWithMethod($"Add request failed due to internal server error{ex.Message}");
                  return (null,"Add request failed due to internal server error");

            }

        }

        public async Task<(bool result,string message)> DeleteConsumerById(int id){

                try{
                 
                _logger.LogInformationWithMethod($"Checking for Consumer with id:{id}");
                var consumer = await _context.Consumers.FindAsync(id);
                if (consumer == null)
                {

                    _logger.LogErrorWithMethod($"Error:Customer with id: {id} not found, Please check the id");
                    return (false,$"Error:Customer with id: {id} not found, Please check the id");
                }

                _logger.LogInformationWithMethod($"Removing Customer with id:{id} from the system");
                _context.Consumers.Remove(consumer);
                await _context.SaveChangesAsync();
                _logger.LogInformationWithMethod($" Customer with id:{id} sucessfully deleted");
                return (true,$" Customer with id:{id} sucessfully deleted");
            }
            catch(Exception ex){
                  _logger.LogErrorWithMethod($"Delete request failed due to some internal server error: {ex.Message}");
                  return (false,"Delete request failed due to some internal server error");

            }

        }

        
        private bool ConsumerExists(int id)
        {
            return _context.Consumers.Any(e => e.ConsumerId == id);
        }
    }
}