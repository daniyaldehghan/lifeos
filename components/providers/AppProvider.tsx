"use client";
import { generateNotifications } from "@/lib/notifications";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { emptyData, loadLifeOS, saveLifeOS } from "@/lib/storage";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { LifeOSData } from "@/lib/types";

interface AppContextValue {
  data: LifeOSData;
  setData: React.Dispatch<React.SetStateAction<LifeOSData>>;
  resetData: () => void;
  ready: boolean;

  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  notifications: import("@/lib/notifications").LifeNotification[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState("");
  const [data, setData] = useState<LifeOSData>(emptyData);
  const [ready, setReady] = useState(false);
  const [notifications, setNotifications] = useState<
    import("@/lib/notifications").LifeNotification[]
  >([]);
  useEffect(() => {
    setData(loadLifeOS());

    const savedName = localStorage.getItem("lifeos-user-name");

    if (savedName) {
      setUserName(savedName);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      saveLifeOS(data);
      localStorage.setItem("lifeos-user-name", userName);
    }
  }, [data, userName, ready]);
  useEffect(() => {
    if (!ready) return;

    const generated = generateNotifications(
      data.tasks,
      data.goals,
      data.events
    );

    setNotifications(generated);
  }, [data.tasks, data.goals, data.events, ready]);
  const value = useMemo(
    () => ({
      userName,
      setUserName,
      data,
      setData,
      resetData: () => setData(emptyData),
      ready,
      notifications,
    }),
    [data, ready, userName]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <WelcomeModal />
    </AppContext.Provider>
  );
}

export function useLifeOS() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useLifeOS must be used inside AppProvider");
  }

  return context;
}
