import { client, checkToken } from "@/services/httpClient";
import { ChargeDepositParams, ChargeDepositResponse } from "./interfaceService";

export const chargeDeposit = async (
  params: ChargeDepositParams
): Promise<ChargeDepositResponse> => {
  try {
    const token = await checkToken();

    const { id, amount, charged_description } = params;

    const { data } = await client.put<ChargeDepositResponse>(
      `/transactions/charge/${id}`,
      { charged_description, amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error(
      "Charge deposit failed:",
      error?.response?.data || error.message
    );
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "An error occurred while charging deposit.",
    };
  }
};
