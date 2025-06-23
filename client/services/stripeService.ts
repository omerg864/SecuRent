import {
    initPaymentSheet,
    presentPaymentSheet
} from "@stripe/stripe-react-native";
import { confirmTransactionPayment } from "@/services/transactionService";
import ShowToast from "@/components/ui/ShowToast";

type StripeFlowOptions = {
    customerId: string;
    ephemeralKey: string;
    clientSecret: string;
    transactionId: string;
    onSuccess: () => void;
    onFail: () => void;
};

export const startDepositPaymentFlow
= async ({
    customerId,
    ephemeralKey,
    clientSecret,
    transactionId,
    onSuccess,
    onFail
}: StripeFlowOptions) => {
    const { error: initError } = await initPaymentSheet({
        customerId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Securent inc."
    });

    if (initError) {
        ShowToast("error", initError.message);
        return onFail();
    }

    const { error: sheetError } = await presentPaymentSheet();

    if (sheetError) {
        ShowToast("error", sheetError.code);
        return onFail();
    }

    try {
        const response = await confirmTransactionPayment(transactionId);
        if (!response.success) {
            ShowToast("error", "Failed to confirm payment");
            return onFail();
        }

        ShowToast("success", "Deposit approved successfully");
        onSuccess();
    } catch (error: any) {
        ShowToast("error", error.response?.data?.message || "Unexpected error");
        onFail();
    }
};
