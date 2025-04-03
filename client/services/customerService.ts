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

const verifyEmailCustomer = async (code: string) => {
  try {
    const accessToken = await checkToken();
    console.log("Access token:", accessToken);
    const response = await client.post<AuthResponse>(
      "customer/verify-email",
      { code },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log(response);
    return response.data.success;
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

const resendCustomerVerificationCode = async () => {
  try {
	const accessToken = await checkToken();
	const response = await client.post<AuthResponse>(
	  "customer/resend-code",
	  {},
	  {
		headers: { Authorization: `Bearer ${accessToken}` },
	  }
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
