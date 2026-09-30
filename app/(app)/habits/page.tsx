"use client";

import { useState } from "react";
import { createId } from "@/lib/utils";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "../../../components/ui/Model";
import { ConfirmDialog } from "../../../components/ui/ConfrimDialog";

export default function HabitsPage() {
  const { data, setData } = useLifeOS();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState(1);
  const [error, setError] = useState("");

  function createHabit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Habit name is required.");
      return;
    }

    if (target < 1) {
      setError("Target must be at least 1.");
      return;
    }

    setData((current) => ({
      ...current,
      habits: [
        {
          id: createId("habit"),
          name: name.trim(),
          description: description.trim(),
          area: "Personal",
          frequency: "Daily",
          target,
          completed: 0,
          streak: 0,
          createdAt: new Date().toISOString(),
        },
        ...current.habits,
      ],
    }));

    setName("");
    setDescription("");
    setTarget(1);
    setError("");
    setOpen(false);
  }

  function removeHabit() {
    if (!deleteId) return;

    setData((current) => ({
      ...current,
      habits: current.habits.filter((habit) => habit.id !== deleteId),
    }));

    setDeleteId(null);
  }

  return (
    <>
      <PageHeader
        title="Habits"
        description="Build consistency through small repeated actions."
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            + New Habit
          </button>
        }
      />

      {data.habits.length === 0 ? (
        <EmptyState
          icon="🔥"
          title="No habits"
          description="Create a habit and start building your consistency streak."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.habits.map((habit) => {
            const progress = Math.min(
              Math.round((habit.completed / habit.target) * 100),
              100
            );

            return (
              <div key={habit.id} className="life-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                    🔥
                  </div>

                  <button
                    onClick={() => setDeleteId(habit.id)}
                    className="text-slate-300 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>

                <h3 className="mt-4 font-bold text-slate-900">{habit.name}</h3>

                <p className="mt-1 text-sm text-slate-500">
                  {habit.description || "Daily consistency habit."}
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-400">Today</span>
                    <span className="font-bold text-orange-600">
                      {habit.completed}/{habit.target}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    🔥 {habit.streak} day streak
                  </span>

                  <button
                    onClick={() =>
                      setData((current) => ({
                        ...current,
                        habits: current.habits.map((item) =>
                          item.id === habit.id
                            ? {
                                ...item,
                                completed:
                                  item.completed >= item.target
                                    ? 0
                                    : item.completed + 1,
                                streak:
                                  item.completed >= item.target
                                    ? item.streak
                                    : item.streak + 1,
                              }
                            : item
                        ),
                      }))
                    }
                    className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-100"
                  >
                    {habit.completed >= habit.target ? "Reset" : "Complete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} title="New Habit" onClose={() => setOpen(false)}>
        <form onSubmit={createHabit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Code for 2 hours"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Daily target
            </label>
            <input
              type="number"
              min="1"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">
            Create Habit
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete habit?"
        description="The habit and its streak information will be removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={removeHabit}
      />
    </>
  );
}
