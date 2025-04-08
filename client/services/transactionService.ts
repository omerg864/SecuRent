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

const createTransactionFromItem = async (itemId: string) => {
  try {
    const accessToken = await checkToken();
    console.log("Access Token:", accessToken);
    const response = await client.post<{ success: boolean }>(
      `transaction/${itemId}`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.success;
  } catch (error) {
    throw error || "Transaction creation failed.";
  }
};

export { chargeDeposit, createTransactionFromItem };
