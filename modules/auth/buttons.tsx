"use client";

export function SignInButton() {
  return (
    <button
      className="button mt-8 w-fit"
      type="button"
      onClick={async () => {
        const { signIn } = await import("next-auth/react");
        await signIn("google", { callbackUrl: "/dashboard" });
      }}
    >
      Accedi con Google
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      className="rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
      type="button"
      onClick={async () => {
        const { signOut } = await import("next-auth/react");
        await signOut({ callbackUrl: "/" });
      }}
    >
      Esci
    </button>
  );
}
