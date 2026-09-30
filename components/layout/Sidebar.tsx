"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLifeOS } from "../providers/AppProvider";

const sections = [
  {
    title: "MAIN",
    items: [
      ["⌂", "My Life", "/"],
      ["🎯", "Goals", "/goals"],
      ["📁", "Projects", "/projects"],
      ["✓", "Tasks", "/tasks"],
    ],
  },
  {
    title: "LIFE",
    items: [
      ["🔥", "Habits", "/habits"],
      ["▣", "Calender", "/calender"],
      ["◷", "Timeline", "/timeline"],
      ["📖", "Journal", "/journal"],
    ],
  },
  {
    title: "MONEY & INSIGHTS",
    items: [
      ["$", "Finance", "/finance"],
      ["◉", "Insights", "/insights"],
      ["◎", "Life Map", "/life-map"],
    ],
  },
];

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
 const {userName}=useLifeOS()
  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white shadow-lg shadow-indigo-200">
              L
            </div>

            <div>
              <h1 className="font-bold tracking-tight text-slate-900">
                LifeOS
              </h1>
              <p className="text-[11px] text-slate-400">
                Personal Operating System
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map(([icon, label, href]) => {
                  const active =
                    pathname === href ||
                    (href !== "/" && pathname.startsWith(href));

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="w-5 text-center">{icon}</span>
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              JD
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
               {userName}
              </p>
              <p className="truncate text-xs text-slate-400">
                Personal Workspace
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}