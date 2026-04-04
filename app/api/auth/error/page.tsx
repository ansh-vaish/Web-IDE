"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");

  let message = "Something went wrong";

  if (error === "NoEmail") {
    message = "Please add a public email to your GitHub account and try again.";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-4 bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl">Sign In Error</h1>
        <p>{message}</p>
        <a href="/auth/sign-in" className=" text-blue-700 underline">
          Return to SignIn
        </a>
      </div>
    </div>
  );
}
