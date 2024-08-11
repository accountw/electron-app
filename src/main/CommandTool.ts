import { spawn } from "child_process";
import { logUtil } from "./log/logUtil";




export namespace commandTool {
    // 要执行 Git 命令的目录路径
    // export let dir: string = "C:\\MetaWorldGames\\MetaApp\\Editor_Win64\\MetaWorldSaved\\Saved\\MetaWorld\\Project\\Edit\\jellyrun";

    export async function execCommand(command: string, args: string[], dir: string) {
        logUtil.warn(`执行命令: ${command}  ${args}  ${dir}`);
        // 执行 Git 命令
        let rs = -1;
        const process = spawn(command, args, { cwd: dir });
        process.stdout.on('data', (data) => {
            logUtil.log(`stdout: ${data}`);
        });
        process.stderr.on('data', (data) => {
            logUtil.error(`stderr: ${data}`);
            if (data.toString().indexOf('fatal') !== -1) {
                rs = 0;
                process.kill();
            }
            if (data.toString().indexOf('error') !== -1) {
                rs = 0;
                process.kill();
            }
            if (data.toString().indexOf('Error') !== -1) {
                rs = 0;
                process.kill();
            }
            if (data.toString().indexOf('ERROR') !== -1) {
                rs = 0;
                process.kill();
            }
            if (data.toString().indexOf('编译失败') !== -1) {
                rs = 0;
                process.kill();
            }
        });
        process.on('close', (code) => {
            if (code != 0) {
                rs = 0;
                process.kill();
            }
            rs = 1;
        });
        return new Promise<number>((resolve) => {
            const timer = setInterval(() => {
                if (rs !== -1) {
                    clearInterval(timer);
                    resolve(rs);
                }
            }, 100);
        })
    }

}
