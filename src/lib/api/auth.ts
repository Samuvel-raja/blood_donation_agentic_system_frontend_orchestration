import { apiUrl } from "@/lib/api/config";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  blood_group: string;
  roles: string[];
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: UserProfile;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const message = (() => {
      try {
        const parsed = JSON.parse(text);
        return parsed.detail ?? parsed.message ?? text;
      } catch {
        return text || `Login failed (${response.status})`;
      }
    })();
    throw new Error(message);
  }

  return response.json();
}

export type RegisterPayload = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  blood_group: string;
  date_of_birth: string;
  address: string;
};

export async function register(payload: RegisterPayload): Promise<LoginResponse> {
  const response = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const message = (() => {
      try {
        const parsed = JSON.parse(text);
        return parsed.detail ?? parsed.message ?? text;
      } catch {
        return text || `Registration failed (${response.status})`;
      }
    })();
    throw new Error(message);
  }

  return response.json();
}
