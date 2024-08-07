import { spawn } from "child_process";
import { LogUtil } from './log/LogUtil'


export namespace CommandTool {
    // 要执行 Git 命令的目录路径
    // export let dir: string = "C:\\MetaWorldGames\\MetaApp\\Editor_Win64\\MetaWorldSaved\\Saved\\MetaWorld\\Project\\Edit\\jellyrun";
    let isExec: boolean = false;
    export function init() {

    }

    export function execCommand(command: string, args: string[], dir: string) {
        if (isExec) {
            LogUtil.error("正在执行命令，请稍后再试");
            return;
        }
        // 执行 Git 命令
        const process = spawn(command, args, { cwd: dir });
        process.stdout.on('data', (data) => {
            LogUtil.log(`stdout: ${data}`);
        });
        process.stderr.on('data', (data) => {
            LogUtil.error(`stderr: ${data}`);
        });
        process.on('close', (code) => {
            LogUtil.warn(`Child process exited with code ${code}`);
        });
    }
}
