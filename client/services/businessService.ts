import client from "./httpClient";
import { AuthData, AuthResponse, LoginCredentials, BusinessLoginResponse } from "./interfaceService";

const registerBusiness = async (businessData : AuthData) => {
  try {
    const response = await client.post<AuthResponse>("business/register", businessData);
    return response.data.success;
  } catch (error) {
    throw error || "Registration failed.";
  }
};

const loginBusiness = async (loginCredentials: LoginCredentials) => {
  try {
    const response = await client.post<BusinessLoginResponse>("business/login", loginCredentials);
    return response.data;
  } catch (error) {
    throw error || "Login failed.";
  }
}

export { registerBusiness, loginBusiness };
