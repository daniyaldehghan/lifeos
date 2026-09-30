"use client";

const values = [58, 72, 45, 81, 64, 88, 76];

export function BalanceChart() {
  const points = values
    .map((value, index) => {
      const x = 20 + index * 48;
      const y = 170 - value * 1.45;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="life-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Life Balance</h3>
          <p className="text-xs text-slate-400">Last 7 days</p>
        </div>

        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          +8.4%
        </span>
      </div>

      <div className="overflow-hidden">
        <svg viewBox="0 0 320 190" className="h-56 w-full">
          {[30, 70, 110, 150].map((y) => (
            <line
              key={y}
              x1="15"
              y1={y}
              x2="305"
              y2={y}
              stroke="#eef0f4"
              strokeWidth="1"
            />
          ))}

          <polyline
            points={points}
            fill="none"
            stroke="#6366f1"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {values.map((value, index) => {
            const x = 20 + index * 48;
            const y = 170 - value * 1.45;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                fill="white"
                stroke="#6366f1"
                strokeWidth="3"
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between text-[11px] text-slate-400">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}