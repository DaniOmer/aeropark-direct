"use client";

import { createContext, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/toast";

type ToastContextType = {
  addToast: (message: string, type: "success" | "error" | "info") => string;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { addToast, removeToast, toastElements } = useToast();

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {toastElements}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
