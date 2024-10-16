import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export function ServerLogout() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
        redirect("/auth/login");
      }}
    >
      <button
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none  focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 hover:bg-red-500 hover:text-white"
        type="submit"
      >
        Log Out
      </button>
    </form>
  );
}
