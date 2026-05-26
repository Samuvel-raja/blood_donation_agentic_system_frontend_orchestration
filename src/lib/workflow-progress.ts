import type { BloodRequestWorkflowState } from "@/lib/api/blood-request";

export type WorkflowNodeId =
  | "intake"
  | "verify"
  | "search"
  | "batch"
  | "notify"
  | "wait"
  | "decide"
  | "done";

const NODE_ORDER: WorkflowNodeId[] = [
  "intake",
  "verify",
  "search",
  "batch",
  "notify",
  "wait",
  "decide",
  "done",
];

export function inferActiveWorkflowNode(state: BloodRequestWorkflowState): WorkflowNodeId {
  if (state.status === "completed") return "done";
  if (state.route) return "decide";
  if (state.waiting_batch_index !== undefined && state.waiting_batch_index >= 0) return "wait";
  if (state.batch && state.batch.length > 0) return "notify";
  if (state.ranked_donors && state.ranked_donors.length > 0) return "batch";
  if (state.hospital_verification_data && Object.keys(state.hospital_verification_data).length > 0) {
    return "search";
  }
  if (state.responses && state.responses.length > 0) return "verify";
  return "intake";
}

export function workflowNodeStates(activeId: WorkflowNodeId): Record<WorkflowNodeId, "done" | "active" | "pending"> {
  const activeIndex = NODE_ORDER.indexOf(activeId);
  return NODE_ORDER.reduce(
    (acc, id, index) => {
      if (index < activeIndex) acc[id] = "done";
      else if (index === activeIndex) acc[id] = "active";
      else acc[id] = "pending";
      return acc;
    },
    {} as Record<WorkflowNodeId, "done" | "active" | "pending">,
  );
}
