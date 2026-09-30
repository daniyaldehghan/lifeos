export function EmptyState({
         icon = "◌",
         title,
         description,
         action,
       }: {
         icon?: string;
         title: string;
         description: string;
         action?: React.ReactNode;
       }) {
         return (
           <div className="life-card flex flex-col items-center justify-center px-6 py-16 text-center">
             <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
               {icon}
             </div>
       
             <h3 className="text-lg font-bold text-slate-900">{title}</h3>
       
             <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
               {description}
             </p>
       
             {action && <div className="mt-5">{action}</div>}
           </div>
         );
       }