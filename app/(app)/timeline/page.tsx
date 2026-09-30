"use client";

import { useState } from "react";
import { createId } from "@/lib/utils";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "../../../components/ui/Model"
import { EmptyState } from "@/components/ui/EmptyState";

export default function TimelinePage() {
  const { data, setData } = useLifeOS();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<
    "Achievement" | "Milestone" | "Memory" | "Life Event"
  >("Achievement");

  function createItem(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim() || !date) return;

    setData((current) => ({
      ...current,
      timeline: [
        {
          id: createId("timeline"),
          title: title.trim(),
          description: description.trim(),
          date,
          type,
          createdAt: new Date().toISOString(),
        },
        ...current.timeline,
      ].sort((a, b) => b.date.localeCompare(a.date)),
    }));

    setTitle("");
    setDescription("");
    setDate("");
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Timeline"
        description="Capture achievements, milestones, memories and important life events."
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            + Add Moment
          </button>
        }
      />

      {data.timeline.length === 0 ? (
        <EmptyState
          icon="◷"
          title="Your timeline starts here"
          description="Record meaningful moments so your progress becomes visible over time."
        />
      ) : (
        <div className="mx-auto max-w-3xl">
          <div className="relative ml-4 border-l-2 border-indigo-100 pl-8">
            {data.timeline.map((item) => (
              <div key={item.id} className="relative mb-8">
                <div className="absolute -left-[43px] top-1 h-5 w-5 rounded-full border-4 border-indigo-100 bg-indigo-600" />

                <div className="life-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                      {item.type}
                    </span>

                    <span className="text-xs text-slate-400">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="mt-3 font-bold text-slate-900">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={open} title="Add Timeline Moment" onClose={() => setOpen(false)}>
        <form onSubmit={createItem} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="First portfolio deployed"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened?"
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as
                  | "Achievement"
                  | "Milestone"
                  | "Memory"
                  | "Life Event"
              )
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          >
            <option>Achievement</option>
            <option>Milestone</option>
            <option>Memory</option>
            <option>Life Event</option>
          </select>

          <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">
            Add to Timeline
          </button>
        </form>
      </Modal>
    </>
  );
}