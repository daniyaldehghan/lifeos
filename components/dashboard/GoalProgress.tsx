export function GoalProgress({
         title,
         progress,
         area,
       }: {
         title: string;
         progress: number;
         area: string;
       }) {
         return (
           <div className="rounded-xl border border-slate-100 p-4">
             <div className="mb-2 flex items-center justify-between gap-4">
               <div className="min-w-0">
                 <p className="truncate text-sm font-semibold text-slate-800">
                   {title}
                 </p>
                 <p className="mt-0.5 text-xs text-slate-400">{area}</p>
               </div>
       
               <span className="text-sm font-bold text-indigo-600">
                 {progress}%
               </span>
             </div>
       
             <div className="h-2 overflow-hidden rounded-full bg-slate-100">
               <div
                 className="h-full rounded-full bg-indigo-600 transition-all"
                 style={{ width: `${Math.min(progress, 100)}%` }}
               />
             </div>
           </div>
         );
       }