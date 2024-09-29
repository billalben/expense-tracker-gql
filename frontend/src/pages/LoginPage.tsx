import { Link } from "react-router-dom";
import { useState } from "react";
import InputField from "../components/InputField";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const loading = false;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loginData.username || !loginData.password)
      return toast.error("Please fill in all fields");
    try {
      // Call login API here
      console.log(loginData);
    } catch (error) {
      // toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="z-50 flex overflow-hidden rounded-lg bg-gray-300">
        <div className="flex w-full min-w-80 items-center justify-center bg-gray-100 sm:min-w-96">
          <div className="w-full max-w-md p-6">
            <h1 className="mb-6 text-center text-3xl font-semibold text-black">
              Login
            </h1>
            <h1 className="mb-6 text-center text-sm font-semibold text-gray-500">
              Welcome back! Log in to your account
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Username"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleChange}
              />

              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
              />
              <div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-black p-2 text-white transition-colors duration-300 hover:bg-gray-800 focus:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                {"Don't"} have an account?{" "}
                <Link to="/signup" className="text-black hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
