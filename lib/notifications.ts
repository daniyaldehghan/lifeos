import { Goal, Task, CalendarEvent } from "@/lib/types";

export type LifeNotification = {
  id: string;
  title: string;
  message: string;
  type: "task" | "goal" | "event";
  sourceId: string;
  date: string;
  read: boolean;
};

function isToday(date: string) {
  const today = new Date();
  const target = new Date(date);

  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
}

function isTomorrow(date: string) {
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  const target = new Date(date);

  return (
    tomorrow.getFullYear() === target.getFullYear() &&
    tomorrow.getMonth() === target.getMonth() &&
    tomorrow.getDate() === target.getDate()
  );
}

export function generateNotifications(
  tasks: Task[],
  goals: Goal[],
  events: CalendarEvent[]
): LifeNotification[] {
  const notifications: LifeNotification[] = [];

  // Tasks
  tasks.forEach((task) => {
    if (task.status === "Completed" || !task.dueDate) return;

    if (isToday(task.dueDate)) {
      notifications.push({
        id: `task-${task.id}`,
        title: "Task due today",
        message: task.title,
        type: "task",
        sourceId: task.id,
        date: task.dueDate,
        read: false,
      });
    } else if (isTomorrow(task.dueDate)) {
      notifications.push({
        id: `task-${task.id}`,
        title: "Task due tomorrow",
        message: task.title,
        type: "task",
        sourceId: task.id,
        date: task.dueDate,
        read: false,
      });
    }
  });

  // Goals
  goals.forEach((goal) => {
    if (goal.status !== "Active" || !goal.targetDate) return;

    if (isToday(goal.targetDate)) {
      notifications.push({
        id: `goal-${goal.id}`,
        title: "Goal deadline today",
        message: goal.title,
        type: "goal",
        sourceId: goal.id,
        date: goal.targetDate,
        read: false,
      });
    } else if (isTomorrow(goal.targetDate)) {
      notifications.push({
        id: `goal-${goal.id}`,
        title: "Goal deadline tomorrow",
        message: goal.title,
        type: "goal",
        sourceId: goal.id,
        date: goal.targetDate,
        read: false,
      });
    }
  });

  // Calendar events
  events.forEach((event) => {
    if (!event.date) return;

    if (isToday(event.date)) {
      notifications.push({
        id: `event-${event.id}`,
        title: `${event.type} today`,
        message: event.title,
        type: "event",
        sourceId: event.id,
        date: event.date,
        read: false,
      });
    } else if (isTomorrow(event.date)) {
      notifications.push({
        id: `event-${event.id}`,
        title: `${event.type} tomorrow`,
        message: event.title,
        type: "event",
        sourceId: event.id,
        date: event.date,
        read: false,
      });
    }
  });

  return notifications;
}