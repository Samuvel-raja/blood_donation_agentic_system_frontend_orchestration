import { useCallback, useRef, useState } from "react";
import {
  createBloodRequest,
  type BloodRequestPayload,
  type BloodRequestWorkflowState,
} from "@/lib/api/blood-request";
import { inferActiveWorkflowNode, type WorkflowNodeId } from "@/lib/workflow-progress";

export type WorkflowLogEvent = {
  time: string;
  level: "info" | "ai" | "warn" | "ok" | "err";
  tag: string;
  message: string;
};

function nowTime() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

function stateToLog(state: BloodRequestWorkflowState): WorkflowLogEvent | null {
  if (state.error) {
    return { time: nowTime(), level: "err", tag: "API", message: state.error };
  }

  const tag = state.current_node
    ? state.current_node.toUpperCase().slice(0, 4)
    : "NODE";

  const statusMsg = state.status ? ` · status: ${state.status}` : "";
  const nodeMsg = state.current_node ? `[${state.current_node}]` : "";

  if (state.status === "completed") {
    return {
      time: nowTime(),
      level: "ok",
      tag: "DONE",
      message: `Workflow completed · request ${state.request_id ?? "—"}`,
    };
  }

  if (state.current_node || state.status) {
    const level =
      state.status === "FAILED"
        ? "err"
        : state.status === "ASSIGNED"
          ? "ok"
          : "info";
    return {
      time: nowTime(),
      level,
      tag,
      message: `${nodeMsg}${statusMsg}${state.request_id ? ` · ${state.request_id}` : ""}`,
    };
  }

  if (state.request_id) {
    return {
      time: nowTime(),
      level: "info",
      tag: "NODE",
      message: `Intake registered · ${state.request_id}`,
    };
  }

  return null;
}


export function useBloodRequestWorkflow() {
  const abortRef = useRef<AbortController | null>(null);
  const [workflowState, setWorkflowState] = useState<BloodRequestWorkflowState | null>(null);
  const [activeNode, setActiveNode] = useState<WorkflowNodeId>("intake");
  const [events, setEvents] = useState<WorkflowLogEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pushEvent = useCallback((event: WorkflowLogEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 50));
  }, []);

  const handleStreamEvent = useCallback(
    (state: BloodRequestWorkflowState) => {
      setWorkflowState(state);
      setActiveNode(inferActiveWorkflowNode(state));
      const log = stateToLog(state);
      if (log) pushEvent(log);
    },
    [pushEvent],
  );

  const startEmergencyRequest = useCallback(
    async (payload: BloodRequestPayload) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsRunning(true);
      setError(null);
      setWorkflowState(null);
      setActiveNode("intake");
      setEvents([]);
      pushEvent({
        time: nowTime(),
        level: "info",
        tag: "API",
        message: "POST /blood-request · streaming workflow",
      });

      try {
        const finalState = await createBloodRequest(payload, handleStreamEvent, controller.signal);
        if (finalState?.request_id) {
          setWorkflowState(finalState);
          setActiveNode(inferActiveWorkflowNode(finalState));
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Failed to start blood request";
        setError(message);
        pushEvent({ time: nowTime(), level: "err", tag: "API", message });
      } finally {
        setIsRunning(false);
      }
    },
    [handleStreamEvent, pushEvent],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsRunning(false);
  }, []);

  return {
    workflowState,
    activeNode,
    events,
    isRunning,
    error,
    startEmergencyRequest,
    cancel,
  };
}
