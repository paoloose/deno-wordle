import * as style from "colors";
import { formatWithColors, printAllAttempts } from "./printing.ts";

let WORD_TO_GUESS: string;
const MAX_TRIES = 6;
const WORD_LENGTH = 5;
let currentAttempt = 0;

const previousGuesses: Array<Array<string>> = [];
const previousPlainGuesses: Array<string> = [];

async function printWordleUI() {
    console.clear();
    console.log(style.white("    W o r d l e\n"));
    await printAllAttempts(previousGuesses, currentAttempt, MAX_TRIES);
}

async function game() {
    WORD_TO_GUESS = (await fetchWord()).Response;
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

async function fetchWord(): Promise<{ Response: string }> {
    console.log(style.brightBlack("Fetching word..."));
    const response = fetch("https://thatwordleapi.azurewebsites.net/get/");
    const res = await response;
    return await res.json();
}

game();
