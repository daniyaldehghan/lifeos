"use client";

import { useState } from "react";
import { createId } from "@/lib/utils";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "../../../components/ui/Model"
import { ConfirmDialog } from "../../../components/ui/ConfrimDialog";

export default function JournalPage() {
  const { data, setData } = useLifeOS();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<
    "Great" | "Good" | "Okay" | "Bad" | "Difficult"
  >("Good");

  function saveEntry(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) return;

    setData((current) => ({
      ...current,
      journal: [
        {
          id: createId("journal"),
          title: title.trim(),
          content: content.trim(),
          mood,
          date: new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
        },
        ...current.journal,
      ],
    }));

    setTitle("");
    setContent("");
    setOpen(false);
  }

  function removeEntry() {
    if (!deleteId) return;

    setData((current) => ({
      ...current,
      journal: current.journal.filter((entry) => entry.id !== deleteId),
    }));

    setDeleteId(null);
  }

  return (
    <>
      <PageHeader
        title="Journal"
        description="A private space to reflect, process and understand your life."
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            + New Entry
          </button>
        }
      />

      {data.journal.length === 0 ? (
        <EmptyState
          icon="📖"
          title="Your journal is empty"
          description="Write down your thoughts, lessons, wins and reflections."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {data.journal.map((entry) => (
            <article key={entry.id} className="life-card p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                  {entry.mood}
                </span>

                <button
                  onClick={() => setDeleteId(entry.id)}
                  className="text-slate-300 hover:text-red-500"
                >
                  ×
                </button>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {entry.title}
              </h3>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-500">
                {entry.content}
              </p>

              <p className="mt-5 text-xs text-slate-400">{entry.date}</p>
            </article>
          ))}
        </div>
      )}

      <Modal open={open} title="New Journal Entry" onClose={() => setOpen(false)}>
        <form onSubmit={saveEntry} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What is on your mind?"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your reflection..."
            rows={8}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <select
            value={mood}
            onChange={(e) =>
              setMood(
                e.target.value as
                  | "Great"
                  | "Good"
                  | "Okay"
                  | "Bad"
                  | "Difficult"
              )
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          >
            <option>Great</option>
            <option>Good</option>
            <option>Okay</option>
            <option>Bad</option>
            <option>Difficult</option>
          </select>

          <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">
            Save Entry
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete journal entry?"
        description="This entry will be permanently removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={removeEntry}
      />
    </>
  );
}