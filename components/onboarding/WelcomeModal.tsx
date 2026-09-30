"use client";

import { FormEvent, useEffect, useState } from "react";

export function WelcomeModal() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const completed = localStorage.getItem("lifeos-onboarding-completed");

    if (!completed) {
      setShow(true);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) return;

    localStorage.setItem("lifeos-user-name", name.trim());
    localStorage.setItem("lifeos-user-email", email.trim());
    localStorage.setItem("lifeos-onboarding-completed", "true");

    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to LifeOS 👋
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Let’s personalize your LifeOS experience.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Your name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
