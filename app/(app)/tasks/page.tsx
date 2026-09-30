"use client";

import { useState } from "react";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "../../../components/ui/Model";
import { TaskForm } from "@/components/forms/TaskForm";
import { ConfirmDialog } from "../../../components/ui/ConfrimDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export default function TasksPage() {
  const { data, setData } = useLifeOS();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function removeTask() {
    if (!deleteId) return;

    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== deleteId),
    }));

    setDeleteId(null);
  }

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Turn your goals and projects into concrete action."
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            + New Task
          </button>
        }
      />

      {data.tasks.length === 0 ? (
        <EmptyState
          icon="✓"
          title="No tasks"
          description="Create actionable work and connect it to your goals."
        />
      ) : (
        <div className="life-card overflow-hidden">
          <div className="hidden grid-cols-[1fr_120px_140px_120px_50px] gap-4 border-b border-slate-100 px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400 md:grid">
            <span>Task</span>
            <span>Priority</span>
            <span>Due date</span>
            <span>Status</span>
            <span />
          </div>

          {data.tasks.map((task) => (
            <div
              key={task.id}
              className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-0 md:grid-cols-[1fr_120px_140px_120px_50px] md:items-center md:gap-4"
            >
              <button
                onClick={() =>
                  setData((current) => ({
                    ...current,
                    tasks: current.tasks.map((item) =>
                      item.id === task.id
                        ? {
                            ...item,
                            status:
                              item.status === "Completed"
                                ? "Todo"
                                : "Completed",
                          }
                        : item
                    ),
                  }))
                }
                className="flex items-center gap-3 text-left"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    task.status === "Completed"
                      ? "border-emerald-500 bg-emerald-500 text-xs text-white"
                      : "border-slate-300"
                  }`}
                >
                  {task.status === "Completed" && "✓"}
                </span>

                <span>
                  <span
                    className={`block text-sm font-semibold ${
                      task.status === "Completed"
                        ? "text-slate-400 line-through"
                        : "text-slate-800"
                    }`}
                  >
                    {task.title}
                  </span>

                  {task.description && (
                    <span className="mt-1 block text-xs text-slate-400">
                      {task.description}
                    </span>
                  )}
                </span>
              </button>

              <span
                className={`w-fit rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  task.priority === "High"
                    ? "bg-red-50 text-red-600"
                    : task.priority === "Medium"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {task.priority}
              </span>

              <span className="text-sm text-slate-500">
                {formatDate(task.dueDate)}
              </span>

              <span className="text-xs font-semibold text-slate-500">
                {task.status}
              </span>

              <button
                onClick={() => setDeleteId(task.id)}
                className="text-left text-sm text-slate-300 hover:text-red-500 md:text-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title="Create Task" onClose={() => setOpen(false)}>
        <TaskForm onSuccess={() => setOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete task?"
        description="This task will be permanently removed from your LifeOS data."
        onCancel={() => setDeleteId(null)}
        onConfirm={removeTask}
      />
    </>
  );
}
