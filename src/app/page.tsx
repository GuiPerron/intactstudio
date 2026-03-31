"use client";

import { NavBar } from "@/components/layout/NavBar";
import { BrainstormPanel } from "@/components/brainstorm/BrainstormPanel";

export default function Home() {
  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: "var(--platform-sand)" }}>
      <NavBar />
      <BrainstormPanel />
    </div>
  );
}
