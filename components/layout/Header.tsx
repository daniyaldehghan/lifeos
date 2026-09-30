"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLifeOS } from "../providers/AppProvider";
import { NotificationBell } from "../notifications/NotificationBell";

export function Header({ onMenu }: { onMenu: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { userName } = useLifeOS();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-us", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);
  const initials = userName
    .trim()
    .split(/\s+/)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenu}
          className="rounded-lg p-2 text-xl text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          ☰
        </button>

        <div>
          <p className="text-sm text-slate-400">Wednesday, September 30</p>
          <h2 className="text-lg font-bold text-slate-900">
            Good morning, {userName}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />
        {time && (
          <div className="text-sm font-medium text-gray-600">{time}</div>
        )}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((value) => !value)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-3 hover:bg-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {userName}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <Link
                href="/settings"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
              >
                Settings
              </Link>

              <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
