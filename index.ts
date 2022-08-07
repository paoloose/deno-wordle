import * as style from "https://deno.land/std@0.146.0/fmt/colors.ts";
import { formatWithColors, printWithAnimation } from "./printing.ts"

const MAX_TRIES = 6;
const WORD_LENGTH = 5;
let currentAttempt = 0;

const previosGuesses: Array<Array<string>> = [];

async function printAllAttempts(guesses: Array<Array<string>>) {
    for (let i = 0; i < MAX_TRIES; i++) {
        if (guesses[i] !== undefined) {
            if (i == currentAttempt) await printWithAnimation(guesses[i]);
            else console.log(guesses[i].join(" "));
        }
        else {
            console.log(`${style.bgBlack("   ")} ${style.bgBlack("   ")} ${style.bgBlack("   ")} ${style.bgBlack("   ")} ${style.bgBlack("   ")}`);
        }
        console.log();
    }
}

async function game() {

    const { Response: WORD_TO_GUESS } = await fetchWord() as { Response: string };
    while (true) {
        console.clear();
        console.log(style.brightMagenta("Welcome to deno-wordle!"));
        console.log(`Secret: ${WORD_TO_GUESS}`);
        await printAllAttempts(previosGuesses);
        const userWord = prompt(">")?.toLowerCase() || "";

        const { error, valid } = validateWord(userWord);
        
        if (valid) {
            const attempt = formatWithColors(userWord, WORD_TO_GUESS);
            previosGuesses.push(attempt);
            console.clear();
            console.log(style.brightMagenta("Welcome to deno-wordle!"));
            console.log(`Secret: ${WORD_TO_GUESS}`);
            await printAllAttempts(previosGuesses);
            
            if (userWord === WORD_TO_GUESS) {
                console.log("You win!");
                break;
            }
            currentAttempt++;
            if (currentAttempt >= MAX_TRIES) {
                console.log("You lose!");
                break;
            }
        }
        else {
            console.log(error);
        }
    }
}

function validateWord(word: string): { error?: string, valid: boolean } {

    if (!word) return { error: "Empty word", valid: false };
    if (word.length !== WORD_LENGTH) return { error: "Not the length", valid: false };
    //if (previosGuesses.includes(word)) return { error: "Already tried", valid: false };
    if (!/^[a-zA-Z]+$/.test(word)) return { error: "Not a valid word", valid: false };
    return { error: "", valid: true };
}

async function fetchWord() {
    console.log(style.brightBlack("Fetching word..."));
    const response = fetch("https://thatwordleapi.azurewebsites.net/get/");
    const res = await response;
    return await res.json();
}

game();
