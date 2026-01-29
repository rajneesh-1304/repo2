import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser= async (loginData:any)=>{
         try{
            const url=`${BASE_URL}/auth/login`
            const res= await axios.post(url, loginData);
            return res.data;
        }catch (error) {
      console.error("Error in Reigstering User:", error);
      throw error;
  }
}

export const registerUser= async (registerData : any)=>{
        try{
            const url=`${BASE_URL}/auth/register`;
            const res= await axios.post(url, registerData);
            return res.data;
        }catch (error) {
      console.error("Error in Reigstering User:", error);
      throw error;
    }
}

export const fetchAllUsers = async () => {
  const response = await axios.get(`${BASE_URL}/auth`); 
  return response.data;
};

export const banUser = async (userId: number) => {
  const response = await axios.patch(`${BASE_URL}/auth/ban/${userId}`);
  return response.data;
};

export const unbanUser = async (userId: number) => {
  const response = await axios.patch(`${BASE_URL}/auth/unban/${userId}`);
  return response.data;
};