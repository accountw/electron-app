import ini from 'ini';
import fs from 'fs';
import path from 'path';
import { logUtil } from '../log/logUtil';
export namespace fileUtils {

    // 读取 .gitmodules 文件
    function readGitmodulesFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf-8');
    }

    // 解析 .gitmodules 文件内容
    function parseGitmodules(content: string): Record<string, any> {
        return ini.parse(content);
    }

    // 提取子模块名称
    function extractModuleNames(parsedContent: Record<string, any>): string[] {
        const moduleNames: string[] = [];
        for (const key in parsedContent) {
            if (key.startsWith('submodule')) {
                const moduleName = key.match(/"([^"]+)"/)?.[1];
                if (moduleName) {
                    moduleNames.push(moduleName);
                }
            }
        }
        return moduleNames;
    }

    // 主函数
    export function getSubmoduleNames(filePath: string): string[] {
        const content = readGitmodulesFile(filePath);
        const parsedContent = parseGitmodules(content);
        return extractModuleNames(parsedContent);
    }
    /**
     * 删除目录中的所有 .lock 文件
     * @param directory 
     */
    export function deleteLockFilesSync(directory: string) {
        // 读取目录中的所有文件和子目录
        const files = fs.readdirSync(directory);
        files.forEach(file => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // 如果是目录，递归调用
                deleteLockFilesSync(filePath);
            } else if (file.endsWith('.lock')) {
                // 如果是 .lock 文件，删除它
                fs.unlinkSync(filePath);
                logUtil.log(`已删除文件: ${filePath}`);
            }
        });
    }

}