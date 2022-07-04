import * as style from "https://deno.land/std@0.146.0/fmt/colors.ts";

const MAX_TRIES = 6;
const WORD_LENGTH = 5;
let tries = 0;

const previosGuesses: Array<string> = [];

async function game() {
    console.log(style.red("Welcome to deno-wordle!"));
    const { Response: WORD_TO_GUESS } = await fetchWord();
    console.log(`Secret: ${WORD_TO_GUESS}`);

    while (true) {
        const userWord = prompt("Guess the word: ") as string;
        const { error, valid } = validateWord(userWord);

        if (valid) {
            if (userWord === WORD_TO_GUESS) {
                console.log("You win!");
                break;
            }
            tries++;
            if (tries >= MAX_TRIES) {
                console.log("You lose!");
                break;
            }
            previosGuesses.push(userWord);
            console.log(`${tries} tries`);
        }
        else {
            console.log(error);
        }
    }
}

function validateWord(word: string): { error?: string, valid: boolean } {

    if (!word) return { error: "Empty word", valid: false };
    if (word.length !== WORD_LENGTH) return { error: "Not the length", valid: false };
    if (previosGuesses.includes(word)) return { error: "Already tried", valid: false };
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
