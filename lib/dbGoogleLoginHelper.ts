const dbGoogleLoginHelper = async (payload: {
  email: string;
  authProvider: string;
}) => {
  if (!payload?.email) return;

  try {
    const response = await fetch(
      "https://college-admission-five.vercel.app/api/auth/google-login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to authenticate with server");
    }

    const data = await response.json();

    // Store the token in localStorage if it exists
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }

    // Store user data if it exists
    if (data.user) {
      localStorage.setItem("currentUser", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Error in dbGoogleLoginHelper:", error);
    throw error;
  }
};

export default dbGoogleLoginHelper;
