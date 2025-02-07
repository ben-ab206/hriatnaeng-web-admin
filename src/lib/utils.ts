import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRole = (name: string) => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    dismissible: true,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
    dismissible: true,
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 3000,
    dismissible: true,
  });
};