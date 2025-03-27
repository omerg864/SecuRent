import { Link } from "react-router-dom";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import GoogleLogin from "../components/GoogleLogin";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { login as loginService } from "../services/adminServices";
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // TODO: connect to the backend

  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(2, "Password must be at least 8 characters"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const user = await loginService(data.email, data.password);
      login(); // Update authentication state
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (authResult) => {
    if (authResult["code"]) {
      setIsLoading(true);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: "1",
          picture: "",
          name: "John Doe",
          email: "",
          role: "Admin",
        })
      );
      login();
      setIsLoading(false);
    } else {
      console.error(authResult);
      toast.error("Google login failed");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="w-full p-8 shadow-default flex items-center justify-center dark:bg-boxdark-2">
      <div className="max-w-2xl flex-1 w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">SecuRent</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Admin Panel
              </h2>

              <form onSubmit={handleSubmit(handleLogin)}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <MdOutlineEmail className="w-6 h-6 absolute right-4 top-4" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Re-type Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="6+ Characters, 1 Capital letter"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <MdLockOutline className="w-6 h-6 absolute right-4 top-4" />
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                <GoogleLogin authResponse={loginWithGoogle} />

                <div className="mt-6 text-center">
                  <p>
                    Don’t have any account?{" "}
                    <Link to="/register" className="text-primary">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
