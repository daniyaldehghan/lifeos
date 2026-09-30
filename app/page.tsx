"use client";

import { useState } from "react";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { GoalProgress } from "@/components/dashboard/GoalProgress";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { Modal } from "../components/ui/Model"
import { GoalForm } from "@/components/forms/GoalForm";
import { TaskForm } from "@/components/forms/TaskForm";
import { formatCurrency, today } from "@/lib/utils";

export default function HomePage() {
  const { data, ready, setData } = useLifeOS();
  const [modal, setModal] = useState<"goal" | "task" | null>(null);

  if (!ready) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-sm text-slate-400">Loading LifeOS...</div>
      </div>
    );
  }

  const completedTasks = data.tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const todayTasks = data.tasks.filter((task) => task.dueDate === today());

  const income = data.transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenses = data.transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const todayHabits = data.habits.reduce(
    (sum, habit) => sum + Math.min(habit.completed / habit.target, 1),
    0
  );

  return (
    <>
      <PageHeader
        title="My Life"
        description="Your personal command center for goals, actions and progress."
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setModal("task")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              + Task
            </button>

            <button
              onClick={() => setModal("goal")}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
            >
              + Goal
            </button>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="🎯"
          label="Active Goals"
          value={data.goals.filter((g) => g.status === "Active").length}
          detail="Keep moving forward"
        />

        <StatCard
          icon="✓"
          label="Tasks Completed"
          value={completedTasks}
          detail={`${todayTasks.length} due today`}
        />

        <StatCard
          icon="🔥"
          label="Habit Momentum"
          value={`${Math.round(
            data.habits.length ? (todayHabits / data.habits.length) * 100 : 0
          )}%`}
          detail="Consistency matters"
        />

        <StatCard
          icon="$"
          label="Net Balance"
          value={formatCurrency(income - expenses)}
          detail={`${formatCurrency(income)} income`}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="life-card p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Today&apos;s Focus</h3>
              <p className="mt-1 text-xs text-slate-400">
                Work connected to your bigger picture.
              </p>
            </div>

            <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {todayTasks.length} tasks
            </span>
          </div>

          {todayTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center">
              <p className="text-3xl">✨</p>
              <p className="mt-3 font-semibold text-slate-700">
                Your day is open.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Add a task to define your focus.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <button
                  key={task.id}
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
                  className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/30"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      task.status === "Completed"
                        ? "border-emerald-500 bg-emerald-500 text-xs text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {task.status === "Completed" ? "✓" : ""}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        task.status === "Completed"
                          ? "text-slate-400 line-through"
                          : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {task.priority} priority
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <BalanceChart />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="life-card p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Active Goals</h3>
              <p className="text-xs text-slate-400">
                Your long-term direction
              </p>
            </div>

            <a
              href="/goals"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View all
            </a>
          </div>

          {data.goals.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No goals yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data.goals.slice(0, 4).map((goal) => (
                <GoalProgress
                  key={goal.id}
                  title={goal.title}
                  progress={goal.progress}
                  area={goal.area}
                />
              ))}
            </div>
          )}
        </div>

        <div className="life-card p-5">
          <div className="mb-5">
            <h3 className="font-bold text-slate-900">Upcoming</h3>
            <p className="text-xs text-slate-400">
              Important things on your horizon
            </p>
          </div>

          {data.events.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No upcoming events.
            </div>
          ) : (
            <div className="space-y-3">
              {data.events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 p-3"
                >
                  <div className="rounded-lg bg-indigo-50 px-3 py-2 text-center">
                    <p className="text-[10px] font-bold uppercase text-indigo-500">
                      {new Date(`${event.date}T00:00:00`).toLocaleDateString(
                        "en",
                        { month: "short" }
                      )}
                    </p>
                    <p className="text-lg font-bold text-indigo-700">
                      {new Date(`${event.date}T00:00:00`).getDate()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {event.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {event.time} · {event.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal
        open={modal === "goal"}
        title="Create New Goal"
        onClose={() => setModal(null)}
      >
        <GoalForm onSuccess={() => setModal(null)} />
      </Modal>

      <Modal
        open={modal === "task"}
        title="Create New Task"
        onClose={() => setModal(null)}
      >
        <TaskForm onSuccess={() => setModal(null)} />
      </Modal>
    </>
  );
}