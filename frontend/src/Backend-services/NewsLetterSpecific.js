import axios from "axios";
import{ API_BASE_URL} from"../apiConfig.js";


const getNewsLetters=()=>{}
const getNewsLettersById=()=>{}
const addNewsletter=()=>{}
const updateNewsLetter=()=>{}
const deleteNewsLetter=()=>{}


const sendNewsLetter = async (id, email) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}NewsLetterSubscriptions/send/${id}`,
        `${email}`, // Send email as plain text
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Newsletter subscription response:", response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.log("Error sending newsletter:", error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data || error.message || "An error occurred while sending the newsletter"
      };
      
    }
  };

export {sendNewsLetter};