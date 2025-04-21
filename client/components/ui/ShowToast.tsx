import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

const ShowToast = (type: ToastType, text1: string, text2?: string) => {
  Toast.show({
    type,
    text1,
    text2,
  });
};

export default ShowToast;
