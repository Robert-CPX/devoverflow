import { Badges } from "@/constants";
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

export const calculateBadges = ({
  reputation, questionNum, answerNum, upvotes, mostViewedQuestion
}: {
  reputation: number, questionNum: number, answerNum: number, upvotes: number, mostViewedQuestion: number
}): Badges => {
  console.log(reputation, questionNum, answerNum, upvotes, mostViewedQuestion)
  const gold = reputation > 1000 ? Math.floor(Math.min(questionNum / 20, answerNum / 40, upvotes / 10000, mostViewedQuestion / 10000)) : 0
  const silver = reputation > 500 ? Math.floor(Math.min(questionNum / 10, answerNum / 20, upvotes / 500, mostViewedQuestion / 1000)) : 0
  const bronze = reputation > 100 ? Math.floor(Math.min(questionNum / 5, answerNum / 10, upvotes / 50, mostViewedQuestion / 100)) : 0

  return {
    bronze,
    silver,
    gold,
  }
}