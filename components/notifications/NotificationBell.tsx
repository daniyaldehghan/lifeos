"use client";

import { useEffect, useRef, useState } from "react";
import { useLifeOS } from "@/components/providers/AppProvider";
import { generateNotifications } from "@/lib/notifications";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to LifeOS",
    message: "Your personal life management system is ready.",
    time: "Just now",
    read: false,
  },
  {
    id: "2",
    title: "Goal reminder",
    message: "Don't forget to review your goals today.",
    time: "10 min ago",
    read: false,
  },
  {
    id: "3",
    title: "Daily check-in",
    message: "Take a moment to review your progress.",
    time: "1 hour ago",
    read: true,
  },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data } = useLifeOS();
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const generated = generateNotifications(
      data.tasks,
      data.goals,
      data.events
    );
    console.log("LifeOS notifications:", generated);
    const formattedNotifications: Notification[] = generated.map(
      (notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        time: notification.date,
        read: notification.read,
      })
    );

    setNotifications(formattedNotifications);
  }, [data.tasks, data.goals, data.events]);
  useEffect(() => {
    const saved = localStorage.getItem("lifeos-notifications");

    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {
        setNotifications(initialNotifications);
      }
    } else {
      setNotifications(initialNotifications);
      localStorage.setItem(
        "lifeos-notifications",
        JSON.stringify(initialNotifications)
      );
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function saveNotifications(updated: Notification[]) {
    setNotifications(updated);

    localStorage.setItem("lifeos-notifications", JSON.stringify(updated));
  }

  function markAsRead(id: string) {
    const updated = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );

    saveNotifications(updated);
  }

  function markAllAsRead() {
    const updated = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    saveNotifications(updated);
  }

  function deleteNotification(id: string) {
    const updated = notifications.filter(
      (notification) => notification.id !== id
    );

    saveNotifications(updated);
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[100] w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>

              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="text-3xl">🔕</div>

                <p className="mt-2 text-sm font-medium text-gray-700">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group border-b border-gray-100 px-4 py-3 ${
                    notification.read ? "bg-white" : "bg-yellow-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-yellow-400" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="text-left"
                        >
                          <p className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {notification.message}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-gray-400 hover:text-red-500"
                          aria-label="Delete notification"
                        >
                          ×
                        </button>
                      </div>

                      <p className="mt-2 text-[11px] text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
