"use server";

import dbConnect from "@/lib/db";
import crypto from "crypto";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { StockServerUser } from "@/models/user-model";

export const generateApiKeyAction = async () => {
  await dbConnect();

  const apiKey = crypto.randomBytes(20).toString("hex");

  const session = await auth();
  const user = session?.user;

  try {
    const userData = await StockServerUser.findOne({ email: user?.email });

    if (userData) {
      userData.apiKey = apiKey;
      await userData.save();
    }

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);

    return {
      success: false,
    };
  }
};
