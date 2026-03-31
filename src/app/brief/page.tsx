"use client";

import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { AgentToggle } from "@/components/agent/AgentToggle";
import { BriefTriage } from "@/components/brief/BriefTriage";
import { BriefForm } from "@/components/brief/BriefForm";

export interface TriageData {
  objective: string;
  urgency: string;
  volume: string;
}

export default function BriefPage() {
  const [step, setStep] = useState<"triage" | "form">("triage");
  const [triage, setTriage] = useState<TriageData | null>(null);

  const handleTriageComplete = (data: TriageData) => {
    setTriage(data);
    setStep("form");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--platform-sand)" }}>
      <NavBar />

      <div className="mx-auto max-w-[960px] px-6 py-8">
        {step === "triage" && <BriefTriage onComplete={handleTriageComplete} />}
        {step === "form" && triage && (
          <BriefForm triage={triage} onBack={() => setStep("triage")} />
        )}
      </div>

      <AgentToggle />
    </div>
  );
}
