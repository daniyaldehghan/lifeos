"use client";

import { useLifeOS } from "@/components/providers/AppProvider";

const areas = [
  "Career",
  "Health",
  "Finance",
  "Learning",
  "Relationships",
  "Personal",
];

export default function LifeMapPage() {
  const { data } = useLifeOS();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Life Map
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          See how your goals distribute across the major areas of your life.
        </p>
      </div>

      <div className="life-card p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {areas.map((area) => {
              const goals = data.goals.filter((goal) => goal.area === area);
              const average = goals.length
                ? Math.round(
                    goals.reduce((sum, goal) => sum + goal.progress, 0) /
                      goals.length
                  )
                : 0;

              return (
                <div
                  key={area}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">{area}</h3>

                    <span className="text-lg font-bold text-indigo-600">
                      {average}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${average}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    {goals.length} connected goal
                    {goals.length === 1 ? "" : "s"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl bg-indigo-600 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">
              LifeOS Principle
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Daily actions become meaningful when they have direction.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
              Connect goals to projects, projects to tasks, and tasks to your
              actual days. The map becomes more useful as you add real data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}