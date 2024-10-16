import { auth } from "@/auth";
import Main from "@/components/Main";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) return redirect("/auth/login");
  return (
    <main>
      <Main />
    </main>
  );
}
