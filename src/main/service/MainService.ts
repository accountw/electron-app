import { dialog } from "electron";
import { ModuleData } from "../data/ModuleData";
import { decorator } from "../utils/decorator";
import { fileUtils } from "../utils/fileUtils";
import { mainWin } from "../index";
import { commandTool } from "../commandTool";
import { fi } from "../../../node_modules/element-plus/es/locale/index";



@decorator.Injectable
export class MainServer {
    getAllSubmodule(path: string, datas: ModuleData[]): boolean {
        fileUtils.deleteLockFilesSync(path + "/.git");
        const targetPath = path + "/.gitmodules";
        const submoduleNames = fileUtils.getSubmoduleNames(targetPath);
        for (const name of submoduleNames) {
            const data = new ModuleData();
            data.moduleName = name;
            datas.push(data);
        }
        datas.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
        return true;
    }

    selectDir() {
        let path = ""
        let isSelect = false;
        dialog.showOpenDialog(mainWin, {
            properties: ['openDirectory'],
        }).then(result => {
            if (!result.canceled) {
                path = result.filePaths[0];
            }
            isSelect = true;
        })
        return new Promise<string>((resolve) => {
            const timer = setInterval(() => {
                if (isSelect) {
                    clearInterval(timer);
                    resolve(path);
                }
            }, 100);
        })
    }

    async updateModules(path: string, modules: ModuleData[], branchName: string) {
        fileUtils.deleteLockFilesSync(path + "/.git");
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            const rt = await this.updateSubmodule(path, module, branchName)
            if (!rt) {
                return false;
            }
        }
        return true;
    }

    async updateSubmodule(path: string, module: ModuleData, branchName: string) {
        const targetPath = path + "\\" + module.moduleName;
        let rt = await commandTool.execCommand("git", ["reset", "--hard"], targetPath);
        if (rt !== 1) {
            return false;
        }
        rt = await commandTool.execCommand("git", ["clean", "-df"], targetPath);
        if (rt !== 1) {
            return false;
        }
        await commandTool.execCommand("git", ["branch", "-D", "temp_branch"], targetPath);
        await commandTool.execCommand("git", ["switch", "-c", "temp_branch"], targetPath);
        await commandTool.execCommand("git", ["switch", "temp_branch"], targetPath);
        await commandTool.execCommand("git", ["fetch"], targetPath);
        await commandTool.execCommand("git", ["branch", "-D", branchName], targetPath);
        rt = await commandTool.execCommand("git", ["checkout", "-b", branchName, "origin/" + branchName], targetPath);
        if (rt !== 1) {
            return false;
        }
        await commandTool.execCommand("git", ["branch", "-D", "temp_branch"], targetPath);
        return true;
    }

    async compile(path: string) {
        let rt = await commandTool.execCommand("compile_all_projects.bat", [], path);
        if (rt !== 1) {
            return false;
        }
        return true;
    }


    async createVersionBranchs(branchName: string, path: string, modules: ModuleData[]) {
        fileUtils.deleteLockFilesSync(path + "/.git");
        await commandTool.execCommand("git", ["branch", "-D", branchName], path);
        let rt = await commandTool.execCommand("git", ["branch", branchName], path);
        if (rt !== 1) {
            return false;
        }
        // rt = await commandTool.execCommand("git", ["push", "origin", branchName], path);
        if (rt !== 1) {
            return false;
        }
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            const rt = await this.createVersionBranch(branchName, path, module)
            if (!rt) {
                return false;
            }
        }
        return true;
    }

    async createVersionBranch(branchName: string, path: string, module: ModuleData) {
        const targetPath = path + "\\" + module.moduleName;
        await commandTool.execCommand("git", ["branch", "-D", branchName], targetPath);
        let rt = await commandTool.execCommand("git", ["branch", branchName], targetPath);
        if (rt !== 1) {
            return false;
        }
        rt = await commandTool.execCommand("git", ["push", "origin", branchName], targetPath);
        if (rt !== 1) {
            return false;
        }
        return true;
    }

}