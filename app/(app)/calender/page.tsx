"use client";

import { useState } from "react";
import { createId } from "@/lib/utils";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "../../../components/ui/Model";
import { ConfirmDialog } from "../../../components/ui/ConfrimDialog";

export default function CalendarPage() {
  const { data, setData } = useLifeOS();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<"Event" | "Deadline" | "Reminder">("Event");

  function createEvent(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim() || !date || !time) return;

    setData((current) => ({
      ...current,
      events: [
        {
          id: createId("event"),
          title: title.trim(),
          description: "",
          date,
          time,
          type,
          createdAt: new Date().toISOString(),
        },
        ...current.events,
      ].sort((a, b) => a.date.localeCompare(b.date)),
    }));

    setTitle("");
    setDate("");
    setTime("");
    setOpen(false);
  }

  function removeEvent() {
    if (!deleteId) return;

    setData((current) => ({
      ...current,
      events: current.events.filter((event) => event.id !== deleteId),
    }));

    setDeleteId(null);
  }

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Unify events, deadlines and reminders."
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            + New Event
          </button>
        }
      />

      {data.events.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Your calendar is clear"
          description="Add events, deadlines and reminders to keep important dates visible."
        />
      ) : (
        <div className="space-y-3">
          {data.events.map((event) => (
            <div
              key={event.id}
              className="life-card flex items-center gap-4 p-4"
            >
              <div className="w-20 rounded-xl bg-indigo-50 p-3 text-center">
                <p className="text-xs font-bold uppercase text-indigo-500">
                  {new Date(`${event.date}T00:00:00`).toLocaleDateString("en", {
                    month: "short",
                  })}
                </p>
                <p className="text-xl font-bold text-indigo-700">
                  {new Date(`${event.date}T00:00:00`).getDate()}
                </p>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{event.title}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  {event.time} · {event.type}
                </p>
              </div>

              <button
                onClick={() => setDeleteId(event.id)}
                className="text-slate-300 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title="New Event" onClose={() => setOpen(false)}>
        <form onSubmit={createEvent} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "Event" | "Deadline" | "Reminder")
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          >
            <option>Event</option>
            <option>Deadline</option>
            <option>Reminder</option>
          </select>

          <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">
            Create Event
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete event?"
        description="This event will be permanently removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={removeEvent}
      />
    </>
  );
}
