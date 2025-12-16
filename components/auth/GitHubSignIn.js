"use client";
import React, { useEffect, useState } from "react";
import { useSignInWithGithub } from "react-firebase-hooks/auth";
import { useSearchParams, useRouter } from "next/navigation";
import auth from "../../lib/firebase.init";
import dbGoogleLoginHelper from "../../lib/dbGoogleLoginHelper";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const GitHubSignIn = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { updateUser } = useAuth();

  const from = searchParams?.get("from") || "/";

  const [signInWithGithub, user, loading, error] = useSignInWithGithub(auth);

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle error
  useEffect(() => {
    if (error) {
      console.error("GitHub Sign In Error:", error.message);
      alert("Error signing in with GitHub. Please try again.");
    }
  }, [error]);

  // Handle successful login
  useEffect(() => {
    if (user) {
      if (user?.user) {
        const { email, displayName } = user.user;
        if (email) {
          (async () => {
            try {
              const data = await dbGoogleLoginHelper({
                email,
                name: displayName,
                authProvider: "github",
              });
              if (data && data.user) {
                updateUser(data.user);
                router.push(from);
              }
            } catch (err) {
              console.error("Google login helper error", err);
            }
          })();
        }
      }
    }
  }, [user, from]);

  // Don't render anything until component is mounted on client
  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-t-lg">
      <div>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => signInWithGithub()}
            className="flex items-center py-2 px-4 text-sm uppercase rounded bg-white hover:bg-gray-100 text-gray-500 border border-transparent hover:border-transparent hover:text-gray-700 shadow-md hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
          >
            GitHub{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitHubSignIn;
