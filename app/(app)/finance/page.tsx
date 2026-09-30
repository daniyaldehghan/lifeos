"use client";

import { useState } from "react";
import { createId, formatCurrency } from "@/lib/utils";
import { useLifeOS } from "@/components/providers/AppProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "../../../components/ui/Model"
import { ConfirmDialog } from "../../../components/ui/ConfrimDialog";

export default function FinancePage() {
  const { data, setData } = useLifeOS();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [date, setDate] = useState("");

  const income = data.transactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = data.transactions
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + item.amount, 0);

  function addTransaction(event: React.FormEvent) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!title.trim() || !category.trim() || numericAmount <= 0 || !date) {
      return;
    }

    setData((current) => ({
      ...current,
      transactions: [
        {
          id: createId("transaction"),
          title: title.trim(),
          category: category.trim(),
          amount: numericAmount,
          type,
          date,
          description: "",
          createdAt: new Date().toISOString(),
        },
        ...current.transactions,
      ],
    }));

    setTitle("");
    setCategory("");
    setAmount("");
    setDate("");
    setOpen(false);
  }

  function removeTransaction() {
    if (!deleteId) return;

    setData((current) => ({
      ...current,
      transactions: current.transactions.filter(
        (item) => item.id !== deleteId
      ),
    }));

    setDeleteId(null);
  }

  return (
    <>
      <PageHeader
        title="Finance"
        description="Understand where your money comes from and where it goes."
        action={
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            + Add Transaction
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon="↗" label="Income" value={formatCurrency(income)} />
        <StatCard icon="↘" label="Expenses" value={formatCurrency(expenses)} />
        <StatCard
          icon="$"
          label="Balance"
          value={formatCurrency(income - expenses)}
        />
      </div>

      <div className="mt-6">
        {data.transactions.length === 0 ? (
          <EmptyState
            icon="$"
            title="No transactions"
            description="Add your first income or expense to start understanding your financial flow."
          />
        ) : (
          <div className="life-card overflow-hidden">
            {data.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 border-b border-slate-100 p-4 last:border-0"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    transaction.type === "Income"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {transaction.type === "Income" ? "↗" : "↘"}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {transaction.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {transaction.category} · {transaction.date}
                  </p>
                </div>

                <p
                  className={`font-bold ${
                    transaction.type === "Income"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "Income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>

                <button
                  onClick={() => setDeleteId(transaction.id)}
                  className="text-slate-300 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={open}
        title="Add Transaction"
        onClose={() => setOpen(false)}
      >
        <form onSubmit={addTransaction} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("Income")}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                type === "Income"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              Income
            </button>

            <button
              type="button"
              onClick={() => setType("Expense")}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                type === "Expense"
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              Expense
            </button>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Transaction title"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category — Food, Salary, Rent..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">
            Save Transaction
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete transaction?"
        description="This financial record will be permanently removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={removeTransaction}
      />
    </>
  );
}