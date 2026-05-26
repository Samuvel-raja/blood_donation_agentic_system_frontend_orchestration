import { useState } from "react";
import {
  BLOOD_GROUP_CHOICES,
  BLOOD_REQUEST_STATUS_CHOICES,
  type BloodGroup,
  type BloodRequestPayload,
  type BloodRequestStatus,
} from "@/lib/api/blood-request";
import { Loader2 } from "lucide-react";

const HOSPITAL_PRESETS = [
  { name: "Apollo Hospitals", address: "IIM, 154/11, Bannerghatta Rd, opposite Krishnaraju Layout, Amalodbhavi Naga, Panduranga Nagar, Bengaluru, Karnataka, 560076" },
  { name: "St. Jude Medical Center", address: "88 Hope Blvd, Metro City" },
  { name: "Oakwood Pediatric", address: "45 Oak Lane, Metro City" },
] as const;

type Props = {
  disabled?: boolean;
  onSubmit: (payload: BloodRequestPayload) => void | Promise<void>;
};

export function NewEmergencyRequestForm({ disabled, onSubmit }: Props) {
  const [patientName, setPatientName] = useState("");
  const [hospital, setHospital] = useState(HOSPITAL_PRESETS[0].name);
  const [hospitalAddress, setHospitalAddress] = useState(HOSPITAL_PRESETS[0].address);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("O-");
  const [quantity, setQuantity] = useState(6);
  const [status, setStatus] = useState<BloodRequestStatus>("SEARCHING");
  const [submitting, setSubmitting] = useState(false);

  function applyHospitalPreset(name: string) {
    const preset = HOSPITAL_PRESETS.find((h) => h.name === name);
    setHospital(name);
    if (preset) setHospitalAddress(preset.address);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: BloodRequestPayload = {
      patient_name: patientName.trim(),
      hospital: hospital.trim(),
      hospital_address: hospitalAddress.trim(),
      blood_group: bloodGroup,
      quantity: Math.max(1, quantity),
      accepted_donors: [],
      status,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = disabled || submitting;
  const canSubmit =
    patientName.trim().length > 0 &&
    hospital.trim().length > 0 &&
    hospitalAddress.trim().length > 0 &&
    quantity >= 1;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <div className="space-y-4">
        <Field label="Patient name" required>
          <input
            required
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            disabled={isDisabled}
          />
        </Field>

        <Field label="Hospital" required>
          <select
            value={hospital}
            onChange={(e) => applyHospitalPreset(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            disabled={isDisabled}
          >
            {HOSPITAL_PRESETS.map((h) => (
              <option key={h.name} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Hospital address" required>
          <input
            required
            value={hospitalAddress}
            onChange={(e) => setHospitalAddress(e.target.value)}
            placeholder="Street, city"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            disabled={isDisabled}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Blood group" required>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              disabled={isDisabled}
            >
              {BLOOD_GROUP_CHOICES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Units" required>
            <input
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm tabular-nums"
              disabled={isDisabled}
            />
          </Field>
        </div>

        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BloodRequestStatus)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            disabled={isDisabled}
          >
            {BLOOD_REQUEST_STATUS_CHOICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <button
          type="submit"
          disabled={isDisabled || !canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-crimson px-3 py-2 text-sm font-semibold text-white shadow-glow-crimson disabled:opacity-50"
        >
          {submitting || disabled ? <Loader2 className="size-4 animate-spin" /> : null}
          Dispatch orchestration
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
        {required ? <span className="text-crimson"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
