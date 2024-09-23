import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isElectron() {
  return typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
}

export function logError(message: string, error?: any) {
  console.error(message, error);
}

export function logInfo(message: string) {
  console.log(message);
}
