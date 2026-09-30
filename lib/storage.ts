import { LifeOSData } from "./types";

const STORAGE_KEY = "lifeos-data-v1";

export const emptyData: LifeOSData = {
  goals: [],
  projects: [],
  tasks: [],
  habits: [],
  events: [],
  timeline: [],
  journal: [],
  transactions: [],
  milestones: [],
};

export function loadLifeOS(): LifeOSData {
  if (typeof window === "undefined") {
    return emptyData;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return emptyData;
    }

    return {
      ...emptyData,
      ...JSON.parse(raw),
    };
  } catch {
    return emptyData;
  }
}

export function saveLifeOS(data: LifeOSData) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearLifeOS() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}