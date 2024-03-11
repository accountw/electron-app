import fs from 'fs';
export namespace JsonUtil {









    // 读取 JSON 文件
    export function readJSONFile(filePath: string): any {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading JSON file: ${error}`);
            return null;
        }
    }
    // 写入 JSON 文件
    export function writeJSONFile(filePath: string, data: any): void {
        try {
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(filePath, jsonData, 'utf-8');
            console.log('JSON file written successfully.');
        } catch (error) {
            console.error(`Error writing JSON file: ${error}`);
        }
    }
}