import * as style from "colors";
import { writeAllSync } from "conversion";
import { WORD_LENGTH } from "./index.ts"

function waitMilliseconds(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function printChar(char: string) {
    const contentBytes = new TextEncoder().encode(char);
    // We use the `writeSync` method to write encoded bytes to the terminal
    // The only way I found to print without a new line
    await waitMilliseconds(200).then(() => {
        writeAllSync(Deno.stdout, contentBytes);
    });
}

export async function printWithAnimation(wordlist: Array<string>) {
    for (const word of wordlist) {
        await printChar(word + " ");
    }
    console.log(); // new line
}

export async function printAllAttempts(guesses: Array<Array<string>>, currentAttempt: number, maxAttempts: number) {
    for (let i = 0; i < maxAttempts; i++) {
        if (guesses[i] !== undefined) {
            if (i+1 == currentAttempt) {
                await printWithAnimation(guesses[i]);
            }
            else console.log(guesses[i].join(" "));
        }
        else {
            let empty = "";
            for (let i = 0; i < WORD_LENGTH; i++) {
                empty += `${style.bgBlack("   ")} `;
            }
            console.log(empty);
        }
        console.log();
    }
}

// 🟨🟩⬛️ Wordle Semantic colors algorithm 🟨🟩⬛️

type Dictionary = {
    [Key: string]: number;
}
const initializateDictonaryToZero = (dict: Dictionary, list: Array<string>) => {
    for (const element of list) {
        dict[element] = 0;
    }
};
const countToDictionary = (dict: Dictionary, key: string) => {
    if (dict[key]) dict[key]++;
    else dict[key] = 1;
};

export function formatWithColors(userWord: string, toGuess: string) {
    const formattedWord: Array<string> = [];

    // To emulate the original Wordle algorithm, we need three dictionaries:

    // To count the ocurrences of each letter in the Answer-word
    const ocurrencesInAnswer: Dictionary = {};
    initializateDictonaryToZero(ocurrencesInAnswer, Array.from(userWord));
    for (const i in Array.from(toGuess)) {
        countToDictionary(ocurrencesInAnswer, toGuess[i]);
    }

    // Initialize dictionary values to 0
    // To have the count of the letters that we are printing
    const ocurrencesPrinted: Dictionary = {};
    initializateDictonaryToZero(ocurrencesPrinted, Array.from(userWord));

    // To count the ocurrences of matched green letters
    const ocurrencesMatched: Dictionary = {};
    initializateDictonaryToZero(ocurrencesMatched, Array.from(userWord));
    for (const i in Array.from(userWord)) {
        if (toGuess[i] === userWord[i]) {
            countToDictionary(ocurrencesMatched, userWord[i]);
        }
    }
    
    // Printing
    for (const i in Array.from(userWord)) {
        let formattedChar: string;
        const currentChar = userWord[i];

        // Conditions to print it in green:
        // 1. The letter is in the Answer-word at the same position
        if (currentChar === toGuess[i]) {
            formattedChar = style.bgGreen(` ${currentChar} `);
            countToDictionary(ocurrencesPrinted, currentChar);
        }
        else {
            // Conditions to print it in yellow:
            // 1. The letter is not green
            // 2. The letter appears in the ocurrencesInAnswer dictionary
            // 3. The times the user green-matched the letter is less than the times that letter appears in the answer
            // 4. The times we printed the letter is less than the times that letter appears in the answer
            if (ocurrencesMatched[currentChar] < ocurrencesInAnswer[currentChar]
                && ocurrencesPrinted[currentChar] < ocurrencesInAnswer[currentChar]) {

                formattedChar = style.bgYellow(` ${currentChar} `);
                countToDictionary(ocurrencesPrinted, currentChar);
            }
            // Conditions to print it in gray:
            // 1. The letter is neither green nor yellow
            else {
                formattedChar = style.bgBrightBlack(` ${currentChar} `);
            }
        }
        formattedWord.push(formattedChar);
    }
    return formattedWord;
}
