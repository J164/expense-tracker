import { signIn } from "@/auth";
import { lusitana } from "./dashboard/fonts";

export default function LoginForm() {
    const formAction = async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
    };

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Please log in to continue.
                </h1>
                <div className="w-full">
                    <button type="submit">Sign in with Google</button>
                </div>
            </div>
        </form>
    );
}
