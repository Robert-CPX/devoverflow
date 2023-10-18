import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - createdAt.getTime();
  const diffInSeconds = diffInMilliseconds / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  const diffInYears = diffInDays / 365; // Considering an average year for simplicity

  if (diffInYears >= 1) {
    return `${Math.floor(diffInYears)} years ago`;
  } else if (diffInDays >= 1) {
    return `${Math.floor(diffInDays)} days ago`;
  } else if (diffInHours >= 1) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInMinutes >= 1) {
    return `${Math.floor(diffInMinutes)} mins ago`;
  } else {
    return "just now";
  }
}

export const formatDateToMonthYear = (date: Date): string => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
}