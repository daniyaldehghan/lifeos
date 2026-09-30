export function StatCard({
         icon,
         label,
         value,
         detail,
       }: {
         icon: string;
         label: string;
         value: string | number;
         detail?: string;
       }) {
         return (
           <div className="life-card p-5">
             <div className="flex items-start justify-between">
               <div>
                 <p className="text-sm font-medium text-slate-500">{label}</p>
                 <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
               </div>
       
               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                 {icon}
               </div>
             </div>
       
             {detail && (
               <p className="mt-3 text-xs font-medium text-emerald-600">{detail}</p>
             )}
           </div>
         );
       }