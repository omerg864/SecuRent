import client from "./httpClient";
import { AuthData, AuthResponse, LoginCredentials, CustomerLoginResponse } from "./interfaceService";

const registerCustomer = async (businessData : AuthData) => {
  try {
    const response = await client.post<AuthResponse>("costumer/register", businessData);
    return response.data.success;
  } catch (error) {
    throw error || "Registration failed.";
  }
};

const loginCustomer = async (loginCredentials: LoginCredentials) => {
  try {
    const response = await client.post<CustomerLoginResponse>("costumer/login", loginCredentials);
    return response.data;
  } catch (error) {
    throw error || "Login failed.";
  }
}

export { registerCustomer, loginCustomer };
