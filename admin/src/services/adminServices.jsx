import axios from "axios";
import { client, setAuthToken } from "./httpClient";

const login = async (email, password) => {
  try {
    const response = await client.post("admin/login", { email, password });

    localStorage.setItem("Access_Token", response.data.accessToken);
    localStorage.setItem("Refresh_Token", response.data.refreshToken);

    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 23);
    localStorage.setItem("Auth_Expiration", expiration.toISOString());

    localStorage.setItem("user", JSON.stringify(response.data.user));

    setAuthToken(response.data.accessToken);

    return response.data.user; // Return user info
  } catch (error) {
    console.log("Login error: ", error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

const register = async (adminData) => {
  try {
    const response = await client.post("admin/register", adminData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server Error: ", error.response.data);
      throw new Error(error.response.data.message || "Server error");
    }
    console.log("Unknown Error:", error);
    throw new Error("An error occurred during registration");
  }
};

export { register, login };
