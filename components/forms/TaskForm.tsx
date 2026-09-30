"use client";

import { FormEvent, useState } from "react";
import { createId } from "@/lib/utils";
import { Priority } from "@/lib/types";
import { useLifeOS } from "@/components/providers/AppProvider";

export function TaskForm({ onSuccess }: { onSuccess: () => void }) {
  const { data, setData } = useLifeOS();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [goalId, setGoalId] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    setData((current) => ({
      ...current,
      tasks: [
        {
          id: createId("task"),
          title: title.trim(),
          description: description.trim(),
          priority,
          status: "Todo",
          dueDate,
          goalId: goalId || undefined,
          createdAt: new Date().toISOString(),
        },
        ...current.tasks,
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

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Task description"
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
        />
      </div>

      <select
        value={goalId}
        onChange={(e) => setGoalId(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
      >
        <option value="">No connected goal</option>
        {data.goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.title}
          </option>
        ))}
      </select>

      <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700">
        Create Task
      </button>
    </form>
  );
}