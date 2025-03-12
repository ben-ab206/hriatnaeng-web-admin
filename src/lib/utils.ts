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
    position: "top-center",
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
    dismissible: true,
    position: "top-center",
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 3000,
    dismissible: true,
    position: "top-center",
  });
};

const generateTimestamp = () => {
  const date = new Date();
  return `${date.getUTCFullYear()}_${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}_${date.getUTCDate().toString().padStart(2, "0")}_${date
    .getUTCHours()
    .toString()
    .padStart(2, "0")}_${date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}_${date
    .getUTCSeconds()
    .toString()
    .padStart(2, "0")}_${date
    .getUTCMilliseconds()
    .toString()
    .padStart(3, "0")}`;
};

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getFileExtension = (filename: string) => {
  return filename.split(".").pop();
};

export { generateTimestamp, convertFileToBase64, getFileExtension };
