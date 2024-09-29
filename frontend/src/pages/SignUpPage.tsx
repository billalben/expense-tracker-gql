import { useState } from "react";
import { Link } from "react-router-dom";
import RadioButton from "../components/RadioButton";
import InputField from "../components/InputField";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState({
    name: "",
    username: "",
    password: "",
    gender: "",
  });

  const loading = false;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      toast.success("Sign up successful");
    } catch (error) {
      console.error("Error:", error);
      // toast.error(error.message);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;

    if (type === "radio") {
      setSignUpData((prevData) => ({
        ...prevData,
        gender: value,
      }));
    } else {
      setSignUpData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="z-50 flex overflow-hidden bg-gray-300 rounded-lg">
        <div className="flex items-center justify-center w-full bg-gray-100 min-w-80 sm:min-w-96">
          <div className="w-full max-w-md p-6">
            <h1 className="mb-6 text-3xl font-semibold text-center text-black">
              Sign Up
            </h1>
            <h1 className="mb-6 text-sm font-semibold text-center text-gray-500">
              Join to keep track of your expenses
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Full Name"
                id="name"
                name="name"
                value={signUpData.name}
                onChange={handleChange}
              />
              <InputField
                label="Username"
                id="username"
                name="username"
                value={signUpData.username}
                onChange={handleChange}
              />

              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={signUpData.password}
                onChange={handleChange}
              />
              <div className="flex gap-10">
                <RadioButton
                  id="male"
                  label="Male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  checked={signUpData.gender === "male"}
                />
                <RadioButton
                  id="female"
                  label="Female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  checked={signUpData.gender === "female"}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full p-2 text-white transition-colors duration-300 bg-black rounded-md hover:bg-gray-800 focus:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Sign Up"}
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-center text-gray-600">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-black hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
