"use client";

import { useState } from "react";
import { useLifeOS } from "@/components/providers/AppProvider";
import { clearLifeOS } from "@/lib/storage";

export default function SettingsPage() {
  const { userName, setUserName, resetData } = useLifeOS();
  console.log(userName);

  const [name, setName] = useState(userName);
  const [saved, setSaved] = useState(false);

  function clearAll() {
    const confirmed = window.confirm(
      "Delete all LifeOS data? This cannot be undone."
    );

    if (!confirmed) return;

    clearLifeOS();
    resetData();
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    setUserName(trimmedName);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your LifeOS workspace.
        </p>
      </div>

      <div className="space-y-5">
        <section className="life-card p-6">
          <h2 className="font-bold text-slate-900">Profile</h2>

          <form onSubmit={saveProfile} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="john"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </form>
        </section>

        <section className="life-card border-red-100 p-6">
          <h2 className="font-bold text-red-600">Danger Zone</h2>

          <p className="mt-2 text-sm text-slate-500">
            Remove all locally stored LifeOS information from this browser.
          </p>

          <button
            onClick={clearAll}
            className="mt-5 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Delete All Data
          </button>
        </section>
      </div>
    </div>
  );
}
