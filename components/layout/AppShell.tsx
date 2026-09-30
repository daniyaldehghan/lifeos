"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-[260px]">
        <Header onMenu={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}