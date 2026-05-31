import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function calculateCGPA(grades: { credits: number; gradePoint: number }[]) {
  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
  const totalPoints = grades.reduce((sum, g) => sum + g.credits * g.gradePoint, 0);
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
}

export const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIML'] as const;
export const COLLEGES = [
  'Your University',
  'Anna University',
  'Madurai Kamaraj University',
  'PSG College of Technology',
  'Thiagarajar College of Engineering',
  'Other'
] as const;
