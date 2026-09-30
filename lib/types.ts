export type LifeArea =
  | "Career"
  | "Health"
  | "Finance"
  | "Learning"
  | "Relationships"
  | "Personal"
  | "Other";

export type Priority = "Low" | "Medium" | "High";

export type GoalStatus = "Active" | "Completed" | "Paused";

export type TaskStatus = "Todo" | "In Progress" | "Completed";

export type TransactionType = "Income" | "Expense";

export interface Goal {
  id: string;
  title: string;
  description: string;
  area: LifeArea;
  targetDate: string;
  progress: number;
  status: GoalStatus;
  createdAt: string;
}

export interface Project {
  id: string;
  goalId: string;
  title: string;
  description: string;
  status: "Planning" | "Active" | "Completed";
  progress: number;
  deadline: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId?: string;
  goalId?: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  area: LifeArea;
  frequency: "Daily" | "Weekly";
  target: number;
  completed: number;
  streak: number;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "Event" | "Deadline" | "Reminder";
  createdAt: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "Achievement" | "Milestone" | "Memory" | "Life Event";
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: "Great" | "Good" | "Okay" | "Bad" | "Difficult";
  date: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  goalId?: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

export interface LifeOSData {
  goals: Goal[];
  projects: Project[];
  tasks: Task[];
  habits: Habit[];
  events: CalendarEvent[];
  timeline: TimelineItem[];
  journal: JournalEntry[];
  transactions: Transaction[];
  milestones: Milestone[];
}