import { checkToken, client } from "./httpClient";
import { AuthData, AuthResponse } from "./interfaceService";
import { BankDetails } from "./interfaceService";

const registerBusiness = async (businessData: AuthData) => {
  try {
    const response = await client.post<AuthResponse>(
      "business/register",
      businessData
    );
    return response.data.success;
  } catch (error) {
    throw error || "Registration failed.";
  }
};

const verifyCompanyNumber = async (companyNumber: string) => {
  try {
    const accessToken = await checkToken();
    if (!accessToken) {
      throw new Error("Access token is missing or invalid.");
    }

    console.log("Access token:", accessToken);
    console.log("Authorization Header:", `Bearer ${accessToken}`);
    console.log("Company number:", companyNumber);

    const response = await client.post<AuthResponse>(
      "business/verify-company-number",
      { companyNumber },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response;
  } catch (error: any) {
    throw error || "Company number verification failed.";
  }
};

const verifyEmailBusiness = async (code: string) => {
  try {
    const accessToken = await checkToken();
    const response = await client.post<AuthResponse>(
      "business/verify-email",
      { code },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.success;
  } catch (error) {
    throw error || "Email verification failed.";
  }
};

const updateBankDetails = async (bankDetails: BankDetails) => {
  try {
    const accessToken = await checkToken();
    const response = await client.post<AuthResponse>(
      "business/verify-bank",
      bankDetails,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.success;
  } catch (error) {
    throw error || "Email verification failed.";
  }
};

export {
  registerBusiness,
  verifyCompanyNumber,
  verifyEmailBusiness,
  updateBankDetails,
};
