"use client";

import { components } from "@/types/apiSchema";
import StepItem from "./StepItem";

type Step = components["schemas"]["Step"];

export default function Sidebar({ steps }: { steps: Step[] }) {
  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
      {steps.map((step) => (
        <StepItem key={step.stepId} step={step} />
      ))}
    </div>
  );
}