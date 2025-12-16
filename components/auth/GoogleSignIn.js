"use client";
import React, { useEffect, useState } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useSearchParams, useRouter } from "next/navigation";
import auth from "../../lib/firebase.init";
import dbGoogleLoginHelper from "../../lib/dbGoogleLoginHelper";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const GoogleSignIn = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { updateUser } = useAuth();

  const from = searchParams?.get("from") || "/";

  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle error
  useEffect(() => {
    if (error) {
      console.error("Google Sign In Error:", error.message);
      alert("Error signing in with Google. Please try again.");
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
                authProvider: "google",
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
    <div className="bg-white rounded-t-lg p-8">
      <p className="text-center text-sm text-gray-400 font-light">
        Sign in with
      </p>
      <div>
        <div className="flex items-center justify-center space-x-4 my-3">
          <button
            onClick={() => signInWithGoogle()}
            className="flex items-center py-2 px-4 text-sm uppercase rounded bg-white hover:bg-gray-100 text-gray-500 border border-transparent hover:border-transparent hover:text-gray-700 shadow-md hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mr-3"
              viewBox="0 0 48 48"
            >
              <path
                fill="#fbc02d"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#e53935"
                d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4caf50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1565c0"
                d="M43.611 20.083 43.595 20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>{" "}
            Google{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignIn;

// "use client";
// import React, { useEffect } from "react";
// import { useSignInWithGoogle } from "react-firebase-hooks/auth";
// import { useLocation, useNavigate } from "react-router-dom";
// import auth from "../../lib/firebase.init";
// import dbGoogleLoginHelper from "../../lib/dbGoogleLoginHelper";
// import { Loader2 } from "lucide-react";
// import { useAuth } from "@/lib/auth-context";

// const GoogleSignIn = () => {
//   const navigate = useNavigate();
//   let location = useLocation();
//   let from = location.state?.from?.pathname || "/";

//   const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

//   // control error
//   useEffect(() => {
//     if (error) {
//       let message = error?.message;
//       console.log(message);
//       alert("Google Login Error");
//     }
//   }, [error]);

//   // control user
//   useEffect(() => {
//     if (user) {
//       const { email } = user?.user;
//       dbGoogleLoginHelper({ email, authProvider: "google" });
//       navigate(from, { replace: true });
//     }
//   }, [user, from, navigate]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-t-lg p-8">
//       <p className="text-center text-sm text-gray-400 font-light">
//         Sign in with
//       </p>
//       <div>
//         <div className="flex items-center justify-center space-x-4 my-3">
//           <button
//             onClick={() => signInWithGoogle()}
//             className="flex items-center py-2 px-4 text-sm uppercase rounded bg-white hover:bg-gray-100 text-indigo-500 border border-transparent hover:border-transparent hover:text-gray-700 shadow-md hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-6 h-6 mr-3"
//               viewBox="0 0 48 48"
//             >
//               <path
//                 fill="#fbc02d"
//                 d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
//               />
//               <path
//                 fill="#e53935"
//                 d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
//               />
//               <path
//                 fill="#4caf50"
//                 d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
//               />
//               <path
//                 fill="#1565c0"
//                 d="M43.611 20.083 43.595 20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
//               />{" "}
//             </svg>{" "}
//             Google{" "}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GoogleSignIn;
