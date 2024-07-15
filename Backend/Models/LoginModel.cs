
using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace SoftwareProject.Models{

    public class LoginModel{
        public string  Email { get; set; }
        public string Password { get; set; }
    }
}