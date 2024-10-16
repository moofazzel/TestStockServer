"use client";

import { credentialLoginAction } from "@/actions/authenticateAction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage(null);
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    const rowFormData = { email, password };

    try {
      setLoading(true);
      const response = await credentialLoginAction(rowFormData);
      if (response?.success) {
        router.push("/");
      } else {
        setErrorMessage("Invalid username or password");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center md:h-screen">
      <div className="w-full max-w-md p-8 space-y-3 border shadow-md rounded-xl">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <form
          onSubmit={loginUser}
          className="space-y-6 ng-untouched ng-pristine ng-valid"
        >
          {errorMessage && (
            <div className="px-4 py-3 text-center text-black bg-red-100 border border-red-500 rounded-lg">
              <p className="font-bold">Warning</p>
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block ">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email "
              className="w-full px-4 py-3 border rounded-md"
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
                required
              />
              <span
                onClick={handlePasswordVisibility}
                className="absolute cursor-pointer right-2 top-3"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          {loading ? (
            <button
              type="button"
              className="px-5 py-2.5 relative rounded group font-medium text-white w-full text-center inline-block"
            >
              <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
              <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
              <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
              <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
              <span className="relative">Login...</span>
            </button>
          ) : (
            <button
              type="submit"
              className="px-5 py-2.5 relative rounded group font-medium text-white w-full text-center inline-block"
            >
              <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
              <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
              <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
              <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
              <span className="relative">Login</span>
            </button>
          )}

          <p className="text-xs text-center sm:px-6">
            Don&apos;t have an account?
            <Link
              href="/auth/register"
              className="font-bold text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
