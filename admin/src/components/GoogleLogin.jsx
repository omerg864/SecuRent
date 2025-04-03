import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

function GoogleLogin({ authResponse }) {
  const googleLogin = useGoogleLogin({
    onSuccess: authResponse,
    onError: authResponse,
    flow: "auth-code",
  });

  return (
    <button
      id="google"
      type="button"
      onClick={googleLogin}
      className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
    >
      <FcGoogle className="w-6 h-6" />
      Sign in with Google
    </button>
  );
}

export default GoogleLogin;
