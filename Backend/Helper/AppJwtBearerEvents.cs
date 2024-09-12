using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace SoftwareProject.Helpers{
    public class AppJwtBearerEvents : JwtBearerEvents
    {
        private readonly ILogger<AppJwtBearerEvents> _logger;
    
        public AppJwtBearerEvents(ILogger<AppJwtBearerEvents> logger)
        {
            _logger = logger;        
        }

        public override Task AuthenticationFailed(AuthenticationFailedContext context)
        {
            _logger.LogInformation("Token-Expired...");
            return base.AuthenticationFailed(context);
        }
    
        public override Task MessageReceived(MessageReceivedContext context)
        {
            _logger.LogInformation("MessageReceived");
            return base.MessageReceived(context);
        }

        public override Task TokenValidated(TokenValidatedContext context)
        {
            _logger.LogInformation("TokenValidated");
            return base.TokenValidated(context);
        }
    }
    
}