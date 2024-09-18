const validName=(word)=>{

   
    if (word==="" || containSymbol(word)){
        console.log("first name cannot contain special symbols");
        return false;
    }
    else{
        console.log("Name Accepted")
        return true;
    }
}

const validEmail=(email)=>{
    if(email===null || email===null){
        return false;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
    return emailPattern.test(email);

}
const validPassword=(password)=>{
    

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSymbol = /[!@#$%]/.test(password);
    const hasMinLength = password.length >= 8;
    console.log("hasUpperCase:", hasUpperCase);
    console.log("hasLowerCase:", hasLowerCase);
    console.log("hasSymbol:", hasSymbol);
    console.log("hasMinLength:", hasMinLength);

    return hasLowerCase && hasUpperCase && hasSymbol &&hasMinLength


}
const validPhoneNo = (PhoneNo) => {
    if (PhoneNo === null || PhoneNo.trim() === "") {
        throw new Error("Phone number is missing");
    }

    const phonePattern = /^\d{10}$/;
    const allSameDigits = /^(\d)\1{9}$/; 

    if (phonePattern.test(PhoneNo) && !allSameDigits.test(PhoneNo)) {
        return true;
    }

    throw new Error("Invalid phone number");
}

function containSymbol(word){
    const symbols=["!","£","$","&"];

    for (let i=0 ;i<word.length;i++){
        if(symbols.includes(word[i])){
            return true;
        }
    }

    return false;
}

export  {validName,validPassword,validEmail,validPhoneNo};