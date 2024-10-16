"use server";

import { signIn } from "@/auth";
import { StockServerUser } from "@/models/user-model";

export async function credentialLoginAction(formData: {
  email: string;
  password: string;
}) {
  try {
    const response = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (response && !response.error) {
      await StockServerUser.findOne({ email: formData.email });
      return {
        success: true,
      };
    } else {
      throw new Error(response.error || "Login failed");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("🚀 ~ error:", error);
      return {
        success: false,
        message: error.message || "An error occurred during login",
      };
    } else {
      console.log("🚀 ~ unknown error:", error);
      return {
        success: false,
        message: "An unknown error occurred",
      };
    }
  }
}
