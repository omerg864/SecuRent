import { client } from "./httpClient";
import { LoginResponse } from "./interfaceService";

const LoginUser = async (email: string, password: string) => {
  try {
    const response = await client.post<LoginResponse>("admin/login/client", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error || "Login failed.";
  }
};

const identifyUser = async (email: string) => {
  try {
    const response = await client.get(`admin/identify-user?email=${email}`);
    return response.data;
  } catch (error: any) {
    throw error || "Identification failed.";
  }
};

export { LoginUser, identifyUser };
