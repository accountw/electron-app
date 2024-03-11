import { exec } from "child_process";

export namespace CommandTool {
    // 要执行 Git 命令的目录路径
    export let dir: string = "C:\\MetaWorldGames\\MetaApp\\Editor_Win64\\MetaWorldSaved\\Saved\\MetaWorld\\Project\\Edit\\jellyrun";

    export function init() {

    }

    export function execCommand(command: string) {

        // 执行 Git 命令
        exec(command, { cwd: dir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行 Git 命令时出错： ${error}`);
                return;
            }
            console.log(`Git 命令输出： ${stdout}`);
            if (stderr) {
                console.error(`Git 命令错误输出： ${stderr}`);
            }
        });
    }
}
