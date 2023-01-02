import * as style from "colors";
import { formatWithColors, printAllAttempts } from "./printing.ts";

let WORD_TO_GUESS: string;
const MAX_TRIES = 6;
export const WORD_LENGTH = 5;
let currentAttempt = 0;

// Arrays of words where each word is splited in letters with colors
const previousGuesses: Array<Array<string>> = [];
// Array of plain words
const previousPlainGuesses: Array<string> = [];

async function printWordleUI() {
  console.clear();
  console.log(style.white("    W o r d l e\n"));
  await printAllAttempts(previousGuesses, currentAttempt, MAX_TRIES);
}

function todaysDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`
}

async function game() {
  WORD_TO_GUESS = (await fetchWordleAPI()).solution;
  let currentUserWord = "";

  while (true) {
    await printWordleUI();
    if (currentUserWord === WORD_TO_GUESS) {
      console.log(`You win! (${currentAttempt}/${MAX_TRIES})`);
      break;
    }
    if (currentAttempt >= MAX_TRIES) {
      console.log(`${style.gray("Was:")} ${style.italic(WORD_TO_GUESS)}`);
      break;
    }

    while (true) {
      currentUserWord = prompt(">")?.toLowerCase() || "";

      const { error, valid } = validateWord(currentUserWord);

      if (valid) {
        previousPlainGuesses.push(currentUserWord);
        const attempt = formatWithColors(currentUserWord, WORD_TO_GUESS);
        previousGuesses.push(attempt);
        currentAttempt++;
        break;
      }
      else {
        console.log(style.gray(error!));
      }
    }
  }
}

function validateWord(word: string): { error?: string, valid: boolean } {
  if (!word) return { error: "Empty word", valid: false };
  if (word.length !== WORD_LENGTH) return { error: "Not the length", valid: false };
  if (previousPlainGuesses.includes(word)) return { error: "Already tried", valid: false };
  if (!/^[a-zA-Z]+$/.test(word)) return { error: "Not a valid word", valid: false };
  return { error: "", valid: true };
}

async function fetchWordleAPI(): Promise<{ solution: string }> {
  console.log(style.brightBlack("Fetching word..."));

  let APIdata: { solution: string };
  const today = todaysDate();
  try {
    const response = await fetch(`https://nytimes.com/svc/wordle/v2/${today}.json`);
    APIdata = await response.json();
  }
  catch (e) {
    console.log(style.brightRed("Couldn't fetch word"));
    console.log(e);
    Deno.exit(-1);
  }
  return APIdata;
}

game();
