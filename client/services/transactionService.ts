import { checkToken, client } from "./httpClient";
import { ChargeDepositPayload, TransactionResponse } from "./interfaceService";
const chargeDeposit = async (
  transactionId: string,
  payload: ChargeDepositPayload
): Promise<TransactionResponse> => {
  const accessToken = await checkToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    const response = await client.put(`/charge/${transactionId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error(
      "Charge deposit failed:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Charge deposit failed");
  }
};

export { chargeDeposit };
