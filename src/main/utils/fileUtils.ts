import ini from 'ini';
import fs from 'fs';
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
}