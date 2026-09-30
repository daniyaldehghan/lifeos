"use client";

import { useMemo } from "react";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

export default function InsightsPage() {
  const { data } = useLifeOS();

  const insights = useMemo(() => {
    const result: string[] = [];

    const completedTasks = data.tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    if (completedTasks > 0) {
      result.push(
        `You have completed ${completedTasks} task${
          completedTasks === 1 ? "" : "s"
        }. Small completed actions are building your execution history.`
      );
    }

    if (data.goals.length > 0) {
      const average =
        data.goals.reduce((sum, goal) => sum + goal.progress, 0) /
        data.goals.length;

      result.push(
        `Your average goal progress is ${Math.round(
          average
        )}%. Review the goals with the lowest progress and connect concrete tasks to them.`
      );
    }

    if (data.habits.length > 0) {
      const bestHabit = [...data.habits].sort(
        (a, b) => b.streak - a.streak
      )[0];

      result.push(
        `"${bestHabit.name}" currently has your longest recorded streak at ${bestHabit.streak} days.`
      );
    }

    const expenses = data.transactions
      .filter((item) => item.type === "Expense")
      .reduce((sum, item) => sum + item.amount, 0);

    if (expenses > 0) {
      result.push(
        `You have recorded ${expenses.toLocaleString()} in expenses. Categorizing transactions makes spending patterns easier to identify.`
      );
    }

    if (!result.length) {
      result.push(
        "Add goals, tasks, habits and financial records to unlock personalized insights."
      );
    }

    return result;
  }, [data]);

  const completedTasks = data.tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const averageGoalProgress = data.goals.length
    ? Math.round(
        data.goals.reduce((sum, goal) => sum + goal.progress, 0) /
          data.goals.length
      )
    : 0;

  return (
    <>
      <PageHeader
        title="Insights"
        description="Patterns calculated from the information you record in LifeOS."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon="✓"
          label="Completed Tasks"
          value={completedTasks}
        />
        <StatCard
          icon="🎯"
          label="Average Goal Progress"
          value={`${averageGoalProgress}%`}
        />
        <StatCard icon="🔥" label="Active Habits" value={data.habits.length} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {insights.map((insight, index) => (
          <div key={index} className="life-card p-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                ✦
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Insight {index + 1}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {insight}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}