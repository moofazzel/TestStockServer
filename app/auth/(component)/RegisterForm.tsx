"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [secretCode, setSecretCode] = useState<boolean>(false);
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>("");

  const router = useRouter();

  const handleSignup = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    // setError(null);
    if (!password) return;

    const userData = {
      username: formState.username,
      email: formState.email,
      password: password,
    };

    //Create user
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (data.status === 400) {
        setError(data.message);
        return;
      }
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSecretCode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const secret = (e.target as HTMLFormElement).secret.value;
    if (secret === "I like turtles") {
      setSecretCode(true); // Ensure setSecretCode is properly typed
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Secret doesn't match!!",
      });
    }
  };

  // Typing for handlePassword
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const pass = e.target.value;
    if (!/(?=.*[A-Z].*[A-Z])/.test(pass)) {
      return setPasswordError("Please provide at least two uppercase");
    }
    if (!/(?=.*[0-9].*[0-9])/.test(pass)) {
      return setPasswordError("Password must have at least 2 numbers");
    }
    if (!/(?=.*[!@#$&*])/.test(pass)) {
      return setPasswordError("Please provide at least one special character");
    }
    if (pass.length < 8) {
      return setPasswordError("Please provide at least 8 characters");
    }

    setPasswordError("");
    setPassword(pass); // Ensure setPassword is properly typed
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {secretCode ? (
        // sign up form
        <div className="flex items-center justify-center md:h-screen">
          <div className="w-full max-w-md px-8 space-y-3 border shadow-md md:p-8 rounded-xl">
            <h1 className="text-2xl font-bold text-center">Sign Up</h1>

            <form
              onSubmit={handleSignup}
              className="space-y-6 ng-untouched ng-pristine ng-valid"
            >
              <div className="space-y-1 text-sm">
                <label htmlFor="username" className="block ">
                  User Name
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="User Name"
                  className="w-full px-4 py-3 border rounded-md"
                  value={formState.username || " "}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1 text-sm">
                <label htmlFor="email" className="block ">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border rounded-md"
                  value={formState.email || " "}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1 text-sm">
                <label htmlFor="password" className="block ">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 border rounded-md"
                    onChange={handlePassword}
                    required
                  />
                  <span
                    onClick={handlePasswordVisibility}
                    className="absolute cursor-pointer right-2 top-3"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {passwordError && (
                  <div className="text-red-500">{passwordError}</div>
                )}
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 relative rounded group font-medium text-white w-full text-center inline-block"
              >
                <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
                <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
                <span className="relative">Sign Up</span>
              </button>
              <p className="pt-2 text-sm text-center">
                Have an account?{" "}
                <Link
                  href="/"
                  className="font-bold text-blue-600 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>

            {error && (
              <div className="p-3 my-3 bg-white rounded shadow-sm">
                <h2 className="text-red-500">{error}</h2>
              </div>
            )}
          </div>
        </div>
      ) : (
        // secret code
        <section className="flex items-center justify-center md:h-screen">
          <div className="w-full max-w-md px-8 space-y-3 border shadow-md md:p-8 rounded-xl">
            <form
              onSubmit={handleSecretCode}
              action=""
              className="space-y-6 ng-untouched ng-pristine ng-valid"
            >
              <div className="space-y-1 text-sm">
                <label htmlFor="username" className="block ">
                  Secret Code
                </label>
                <input
                  type="text"
                  name="secret"
                  id="secret"
                  placeholder="Enter secret code"
                  className="w-full px-4 py-3 border rounded-md"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 relative rounded group font-medium text-white w-full text-center inline-block"
              >
                <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
                <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
                <span className="relative">Submit</span>
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default RegisterForm;
