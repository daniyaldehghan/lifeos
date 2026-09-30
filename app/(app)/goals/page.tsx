"use client";

import { useState } from "react";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { GoalForm } from "@/components/forms/GoalForm";
import { Modal } from "../../../components/ui/Model";
import { ConfirmDialog } from "../../../components/ui/ConfrimDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export default function GoalsPage() {
  const { data, setData } = useLifeOS();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function deleteGoal() {
    if (!deleteId) return;

    setData((current) => ({
      ...current,
      goals: current.goals.filter((goal) => goal.id !== deleteId),
      projects: current.projects.filter(
        (project) => project.goalId !== deleteId
      ),
      tasks: current.tasks.filter((task) => task.goalId !== deleteId),
      milestones: current.milestones.filter(
        (milestone) => milestone.goalId !== deleteId
      ),
    }));

    setDeleteId(null);
  }

  return (
    <>
      <PageHeader
        title="Goals"
        description="Define where you want your life to go."
        action={
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + New Goal
          </button>
        }
      />

      {data.goals.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No goals yet"
          description="Create your first goal and start connecting your daily actions to a bigger direction."
          action={
            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Create Goal
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.goals.map((goal) => {
            const connectedProjects = data.projects.filter(
              (project) => project.goalId === goal.id
            ).length;

            const connectedTasks = data.tasks.filter(
              (task) => task.goalId === goal.id
            ).length;

            return (
              <div key={goal.id} className="life-card p-5">
                <div className="mb-4 flex items-start justify-between">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                    {goal.area}
                  </span>

                  <button
                    onClick={() => setDeleteId(goal.id)}
                    className="text-slate-300 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>

                <h3 className="font-bold text-slate-900">{goal.title}</h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                  {goal.description || "No description provided."}
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-bold text-indigo-600">
                      {goal.progress}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-lg font-bold text-slate-800">
                      {connectedProjects}
                    </p>
                    <p className="text-xs text-slate-400">Projects</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-lg font-bold text-slate-800">
                      {connectedTasks}
                    </p>
                    <p className="text-xs text-slate-400">Tasks</p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-400">
                  Target: {formatDate(goal.targetDate)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={createOpen}
        title="Create Goal"
        onClose={() => setCreateOpen(false)}
      >
        <GoalForm onSuccess={() => setCreateOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete goal?"
        description="This will also remove projects, tasks and milestones connected to this goal."
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteGoal}
      />
    </>
  );
}
