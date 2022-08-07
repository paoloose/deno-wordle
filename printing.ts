import * as style from "colors";
import { writeAllSync } from "conversion";

function waitMilliseconds(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function printChar(char: string) {
    const contentBytes = new TextEncoder().encode(char);
    await waitMilliseconds(200).then(() => {
        writeAllSync(Deno.stdout, contentBytes);
    });
}

export async function printWithAnimation(wordlist: Array<string>) {
    for (const word of wordlist) {
        await printChar(word + " ");
    }
    console.log();
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
            console.log(
                `${style.bgBlack("   ")} ${style.bgBlack("   ")} ${style.bgBlack("   ")
                } ${style.bgBlack("   ")} ${style.bgBlack("   ")}`,
            );
        }
        console.log();
    }
}

export function formatWithColors(userWord: string, toGuess: string) {
    // Printing word animation
    const formattedWord: Array<string> = [];

    for (const i in Array.from(userWord)) {
        let formattedChar: string;
        if (userWord[i] === toGuess[i]) {
            formattedChar = style.bgGreen(` ${userWord[i]} `);
        }
        else {
            if (toGuess.includes(userWord[i])) {
                formattedChar = style.bgYellow(` ${userWord[i]} `);
            }
            else {
                formattedChar = style.bgBrightBlack(` ${userWord[i]} `);
            }
        }
        formattedWord.push(formattedChar);
        //await printChar(formattedChar);
    }
    console.log();
    return formattedWord;
}
