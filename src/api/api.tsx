import * as jwt_decode from "jwt-decode";
import { BE_URL } from "../utils/Constants";

// Check if access token is expired
const isAccessTokenExpired = (accessToken: string | null): boolean => {
  if (!accessToken) return true;
  const decodedToken = jwt_decode.jwtDecode(accessToken);
  if (decodedToken && decodedToken?.exp) {
    return Date.now() >= decodedToken.exp * 1000;
  }
  return true;
};

// Token refresh function
const refreshToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await fetch(`${BE_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }
    const data = await response.json();
    const newAccessToken = data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    // Handle token refresh failure or other errors
    console.error("Token refresh failed:", error);
    throw error;
  }
};

// Fetch interceptor function for attaching access token
const fetchWithAccessToken = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  let accessToken = localStorage.getItem("accessToken");
  if (!accessToken || isAccessTokenExpired(accessToken)) {
    // Access token is expired, refresh it
    accessToken = await refreshToken();
  }
  const headers = init?.headers || ({} as any);
  headers["Authorization"] = `${accessToken}`;
  return fetch(input, { ...init, headers });
};

export { fetchWithAccessToken };
