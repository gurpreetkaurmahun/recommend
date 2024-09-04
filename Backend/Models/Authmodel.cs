
using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace SoftwareProject {


    public class AuthModel
{
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        public string FName { get; set; }

        public string LName{ get; set; }

        public string Address { get; set; }
        public string ContactNo { get; set; }

        public DateTime Dob{get;set;}

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public string? FullLocation { get; set; }

   
}

}

