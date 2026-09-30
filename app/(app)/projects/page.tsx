"use client";

import { useState } from "react";
import { createId } from "@/lib/utils";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "../../../components/ui/Model";
import { ConfirmDialog } from "../../../components/ui/ConfrimDialog";

export default function ProjectsPage() {
  const { data, setData } = useLifeOS();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalId, setGoalId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  function createProject(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!deadline) {
      setError("Deadline is required.");
      return;
    }

    setData((current) => ({
      ...current,
      projects: [
        {
          id: createId("project"),
          title: title.trim(),
          description: description.trim(),
          goalId,
          deadline,
          progress: 0,
          status: "Planning",
          createdAt: new Date().toISOString(),
        },
        ...current.projects,
      ],
    }));

    setTitle("");
    setDescription("");
    setGoalId("");
    setDeadline("");
    setError("");
    setOpen(false);
  }

  function removeProject() {
    if (!deleteId) return;

    setData((current) => ({
      ...current,
      projects: current.projects.filter((item) => item.id !== deleteId),
      tasks: current.tasks.filter((task) => task.projectId !== deleteId),
    }));

    setDeleteId(null);
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="Turn goals into meaningful bodies of work."
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            + New Project
          </button>
        }
      />

      {data.projects.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No projects"
          description="Projects give your goals a practical structure."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.projects.map((project) => {
            const goal = data.goals.find((item) => item.id === project.goalId);

            return (
              <div key={project.id} className="life-card p-5">
                <div className="flex items-start justify-between">
                  <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600">
                    {project.status}
                  </span>

                  <button
                    onClick={() => setDeleteId(project.id)}
                    className="text-slate-300 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {project.description || "No description."}
                </p>

                {goal && (
                  <div className="mt-4 rounded-xl bg-indigo-50 p-3">
                    <p className="text-[10px] font-bold uppercase text-indigo-500">
                      Connected Goal
                    </p>
                    <p className="mt-1 text-sm font-semibold text-indigo-700">
                      {goal.title}
                    </p>
                  </div>
                )}

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-bold text-indigo-600">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Deadline: {project.deadline}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} title="Create Project" onClose={() => setOpen(false)}>
        <form onSubmit={createProject} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Build Professional Portfolio"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Project description"
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

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

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">
            Create Project
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete project?"
        description="Connected tasks will also be deleted."
        onCancel={() => setDeleteId(null)}
        onConfirm={removeProject}
      />
    </>
  );
}
