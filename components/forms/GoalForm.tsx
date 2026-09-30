"use client";

import { FormEvent, useState } from "react";
import { createId } from "@/lib/utils";
import { LifeArea } from "@/lib/types";
import { useLifeOS } from "@/components/providers/AppProvider";

export function GoalForm({ onSuccess }: { onSuccess: () => void }) {
  const { setData } = useLifeOS();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState<LifeArea>("Career");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Goal title is required.");
      return;
    }

    if (!targetDate) {
      setError("Target date is required.");
      return;
    }

    setData((current) => ({
      ...current,
      goals: [
        {
          id: createId("goal"),
          title: title.trim(),
          description: description.trim(),
          area,
          targetDate,
          progress: 0,
          status: "Active",
          createdAt: new Date().toISOString(),
        },
        ...current.goals,
      ],
    }));

    onSuccess();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Goal title
        </label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Become a Senior Frontend Developer"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="Describe what success looks like..."
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Life area
          </label>
          <select
            value={area}
            onChange={(event) => setArea(event.target.value as LifeArea)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          >
            <option>Career</option>
            <option>Health</option>
            <option>Finance</option>
            <option>Learning</option>
            <option>Relationships</option>
            <option>Personal</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Target date
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        Create Goal
      </button>
    </form>
  );
}