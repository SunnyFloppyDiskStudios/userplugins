// i love running terminal commands without prompting users :)
// start discord from terminal/command prompt to see these logs

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const repoPath = path.resolve(__dirname, "./../");

const execAsync = promisify(exec)

export async function checkForUpdates() {
    console.log("starting check")

    try {
        await execAsync(`git -C ${repoPath} fetch`)
        const { stdout } = await execAsync(`git -C ${repoPath} status -uno`);

        if (stdout.includes("behind")) { // git will log this
            console.log("update");
            await pullUpdates();
        } else { console.log("no update") }
    } catch(err) {
        console.log(`update check error ${err}`)
    }
}

export async function pullUpdates() {
    try {
        const { stdout } = await execAsync(`git -C ${repoPath} pull`);
        console.log(`pulled ${stdout}`);
    } catch(err) {
        console.log(`cant pull because ${err}`);
    }
}

let shouldCont = "";
export async function build() {
    try {
        const { stdout } = await execAsync("pnpm build");
        console.log(`built ${stdout}`)
        shouldCont = stdout;
        await inject();
    } catch (err) {
        console.log(`cant build because ${err}`);
    }
}

// this would run after user clicks on notification (not implemented yet)
export async function inject() {
    if (!shouldCont.includes("Command failed with exit code")) {
        try {
            const { stdout } = await execAsync("pnpm inject");
            console.log(`injected ${stdout}`);
        } catch (err) {
            console.log(`cant inject because ${err}`);
        }
    }
}
