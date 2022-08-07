import * as style from "colors";
import { writeAllSync } from "conversion";

function waitMilliseconds(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function printChar(char: string) {
    const contentBytes = new TextEncoder().encode(char);
    await waitMilliseconds(300).then(() => {
        writeAllSync(Deno.stdout, contentBytes);
    });
}

export async function printWithAnimation(wordlist: Array<string>) {
    for (const word of wordlist) {
        await printChar(word + " ");
    }
    console.log();
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
