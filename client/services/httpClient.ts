import axios from "axios";
import Constants from "expo-constants";

const URL = Constants.expoConfig?.extra?.apiUrl as string;
console.log("API URL:", URL);

const client = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// const checkToken = async (): Promise<string> => {
//   let token = Cookies.get("authToken");
//   const storedRefreshToken = Cookies.get("refreshToken");
//   const expiration = Cookies.get("AuthExpiration");

//   if (!token) {
//     if (!storedRefreshToken) {
//       throw new Error("User is not authenticated");
//     }
//     token = await refreshToken(storedRefreshToken);
//   }

//   if (expiration && new Date(expiration) < new Date()) {
//     if (!storedRefreshToken) {
//       throw new Error("No refresh token");
//     }
//     token = await refreshToken(storedRefreshToken);
//   }

//   return token;
// };


export default client;