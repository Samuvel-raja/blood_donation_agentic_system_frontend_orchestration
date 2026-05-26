import { apiUrl } from "@/lib/api/config";

export type UserJson = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  date_of_birth: string;
  address: string;
  blood_group: string;
  roles: string[];
  last_donation_date?: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export async function usersByBloodGroup(bloodGroup?: string): Promise<UserJson[]> {
  const response = await fetch(apiUrl("/usersbybloodgroup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blood_group: bloodGroup || "" }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Failed to load donors (${response.status})`);
  }

  return response.json();
}

