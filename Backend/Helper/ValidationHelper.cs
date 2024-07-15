namespace SoftwareProject.Helpers{
    public class ValidationHelper{

        public static bool Validpassword(string password){

            if(string.IsNullOrEmpty(password) ||  password.Length<8){
                return false;
            }

            bool hasUppercase=password.Any(char.IsUpper);
            bool hasLowercase=password.Any(char.IsLower);
            bool hasDigit=password.Any(char.IsDigit);
            bool isSpecial=password.Any(ch=>!char.IsLetterOrDigit(ch));

            return hasUppercase && hasLowercase && hasDigit  && isSpecial;
                
        }

        public static bool IsValidUsername(string username){
            if(string.IsNullOrEmpty(username) || username.Length<0 || username.Length>25){
                return false;
            }

            return username.All(char.IsLetter);
        }

       
    }
}