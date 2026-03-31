"use client";

import { useState } from "react";
import { BrandId } from "@/lib/brand/config";
import { Header } from "@/components/layout/Header";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function ChatPage() {
  const [activeBrand, setActiveBrand] = useState<BrandId>("intact");

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header activeBrand={activeBrand} onBrandChange={setActiveBrand} />
      <ChatPanel brand={activeBrand} />
    </div>
  );
}
