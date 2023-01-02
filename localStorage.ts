import { todaysDate } from "./date.ts";

const previousAttempts = window.localStorage.getItem(todaysDate()) as string;

export const todayAttempt = JSON.parse(previousAttempts) as unknown as {
  previousGuesses: Array<Array<string>>,
  previousPlainGuesses: Array<string>
} ?? null;
