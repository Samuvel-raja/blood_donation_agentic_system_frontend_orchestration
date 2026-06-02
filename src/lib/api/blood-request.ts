import { apiUrl } from "@/lib/api/config";

export const BLOOD_GROUP_CHOICES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUP_CHOICES)[number];

export const BLOOD_REQUEST_STATUS_CHOICES = [
  "SEARCHING",
  "WAITING",
  "ASSIGNED",
  "FAILED",
] as const;

export type BloodRequestStatus = (typeof BLOOD_REQUEST_STATUS_CHOICES)[number];

/** Fields persisted on BloodRequest (POST /blood-request body). */
export type BloodRequestPayload = {
  patient_name: string;
  hospital: string;
  hospital_address: string;
  blood_group: BloodGroup;
  quantity: number;
  accepted_donors?: string[];
  status?: BloodRequestStatus;
};

export type BloodRequestWorkflowState = {
  request_id?: string;
  status?: string;
  current_node?: string;
  route?: string;
  request_data?: Record<string, unknown>;
  hospital_verification_data?: Record<string, unknown>;
  ranked_donors?: unknown[];
  batch?: unknown[];
  responses?: unknown[];
  accepted_donors?: unknown[];
  waiting_batch_index?: number;
  current_batch_index?: number;
  error?: string;
};

export type BloodRequestStreamHandler = (state: BloodRequestWorkflowState) => void;

export async function createBloodRequest(
  payload: BloodRequestPayload,
  onEvent: BloodRequestStreamHandler,
  signal?: AbortSignal,
): Promise<BloodRequestWorkflowState | undefined> {
  const response = await fetch(apiUrl("/blood-request"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      accepted_donors: [],
      status: "SEARCHING",
      ...payload,
    }),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Blood request failed (${response.status})`);
  }

  if (!response.body) {
    throw new Error("Blood request stream unavailable");
  }

  return readBloodRequestStream(response.body, onEvent);
}

export async function getBloodRequest(requestId: string): Promise<BloodRequestWorkflowState> {
  const response = await fetch(apiUrl(`/blood-request/${requestId}`));
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Failed to load request (${response.status})`);
  }
  return response.json();
}

async function readBloodRequestStream(
  body: ReadableStream<Uint8Array>,
  onEvent: BloodRequestStreamHandler,
): Promise<BloodRequestWorkflowState | undefined> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let latest: BloodRequestWorkflowState | undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const dataLine = chunk
        .split("\n")
        .find((line) => line.startsWith("data: "));

      if (!dataLine) continue;

      const raw = dataLine.slice(6).trim();
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw) as BloodRequestWorkflowState;
        if (parsed.error) {
          throw new Error(parsed.error);
        }
        latest = parsed;
        onEvent(parsed);
      } catch (err) {
        if (err instanceof SyntaxError) continue;
        throw err;
      }
    }
  }

  return latest;
}
