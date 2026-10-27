
import {
  apiRequest,
  clearCsrfToken,
  refreshCsrfToken,
} from "../../../services/apiClient";

interface LoginResponse {
  message: string;
  home_page?: string;
  full_name?: string;
}

interface CurrentUserResponse {
  message: string;
}

export interface AuthUser {
  fullName: string;
}

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  // apiRequest obtains the guest-session CSRF token before the POST.
  const response = await apiRequest<LoginResponse>("/api/method/login", {
    method: "POST",
    body: JSON.stringify({
      usr: username,
      pwd: password,
    }),
  });

  if (response.message !== "Logged In") {
    throw new Error("Login was not successful.");
  }

  // The session has changed. Replace the guest token with a fresh token.
  try {
    await refreshCsrfToken();
  } catch (error) {
    // Do not leave a potentially stale token cached after login.
    clearCsrfToken();
    throw error;
  }

  return {
    fullName: response.full_name ?? username,
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await apiRequest<CurrentUserResponse>(
      "/api/method/frappe.auth.get_logged_user",
    );

    if (!response.message || response.message === "Guest") {
      clearCsrfToken();
      return null;
    }

    return { fullName: response.message };
  } catch {
    // Existing behavior retained for now.
    return null;
  }
}

export async function logout(): Promise<void> {
  await apiRequest("/api/method/logout", {
    method: "POST",
  });

  // Clear the cached token only after Frappe confirms logout.
  clearCsrfToken();
}
