import { client } from "./httpClient";
import { AuthData, AuthResponse, CreditCardData } from "./interfaceService";
import { checkToken } from "./httpClient";

const registerCustomer = async (businessData: AuthData) => {
  try {
    const response = await client.post<AuthResponse>(
      "customer/register",
      businessData
    );
    return response.data.success;
  } catch (error) {
    throw error || "Registration failed.";
  }
};

const updateCreditCard = async (creditCardData: CreditCardData) => {
  try {
    console.log(creditCardData);
    const accessToken = await checkToken();
    const response = await client.put<AuthResponse>(
      "customer/update/credit-card",
      creditCardData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response;
  } catch (error) {
    throw error || "Credit card update failed.";
  }
};

const verifyEmailCustomer = async (code: string, userId: string) => {
  try {
    const response = await client.post<AuthResponse>(
      "customer/verify-email",
      { code, userId}
    );
    return response.data;
  } catch (error) {
    throw error || "Email verification failed.";
  }
};

const updateCustomerPassword = async (newPassword: string) => {
  try {
    const accessToken = await checkToken();
    const response = await client.put<AuthResponse>(
      "customer/update-password",
      { newPassword },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.success;
  } catch (error) {
    throw error || "Password update failed.";
  }
};

const resendCustomerVerificationCode = async (userId : string) => {
  try {
	const response = await client.post<AuthResponse>(
	  "customer/resend-code",
	  {userId}
	);
	return response.data.success;
  } catch (error) {
	throw error || "Resending verification code failed.";
  }
};

export {
  registerCustomer,
  updateCreditCard,
  verifyEmailCustomer,
  updateCustomerPassword,
  resendCustomerVerificationCode,
};
