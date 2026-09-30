export function createId(prefix = "item") {
         return `${prefix}-${Date.now()}-${Math.random()
           .toString(36)
           .slice(2, 9)}`;
       }
       
       export function formatDate(date: string) {
         if (!date) return "No date";
       
         return new Intl.DateTimeFormat("en-US", {
           month: "short",
           day: "numeric",
           year: "numeric",
         }).format(new Date(`${date}T00:00:00`));
       }
       
       export function formatCurrency(amount: number) {
         return new Intl.NumberFormat("en-US", {
           style: "currency",
           currency: "USD",
         }).format(amount);
       }
       
       export function today() {
         return new Date().toISOString().split("T")[0];
       }
       
       export function percent(value: number, total: number) {
         if (!total) return 0;
       
         return Math.round((value / total) * 100);
       }