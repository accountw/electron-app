import { ControllerBase } from "../utils/controllerBase";
import { decorator } from "../utils/decorator";
import { MainServer } from "../service/mainService";
import { error, MainResponse, success } from "../../lib/mainResponse";
import { ModuleData } from "../data/ModuleData";




export class MainController extends ControllerBase {


    @decorator.Inject(MainServer)
    public mainServer!: MainServer;


    @decorator.Route("/getAllSubmodule")
    getAllSubmodule(path: string): MainResponse<ModuleData[]> {
        if (!path) return error<ModuleData[]>([]);
        const datas: ModuleData[] = [];
        const rt = this.mainServer.getAllSubmodule(path, datas)
        if (rt) {
            return success<ModuleData[]>(datas)
        }
        return error<ModuleData[]>(datas)
    }

    @decorator.Route("/selectDir")
    async selectDir() {
        const path = await this.mainServer.selectDir()
        if (path) {
            return success<string>(path)
        }
        return error<string>(path)
    }
    @decorator.Route("/updateModules")
    async updateModules(path: string, modules: ModuleData[], branchName: string) {
        if (!modules) {
            return error<boolean>(false)
        }
        const rt = await this.mainServer.updateModules(path, modules, branchName)
        if (rt) {
            return success<boolean>(true)
        }
        return error<boolean>(false)
    }

    @decorator.Route("/compile")
    async compile(path: string) {
        const rt = await this.mainServer.compile(path);
        if (rt) {
            return success<boolean>(true);
        }
        return error<boolean>(false);
    }

    @decorator.Route("/createVersionBranchs")
    async createVersionBranchs(branchName: string, path: string, modules: ModuleData[]) {
        const rt = await this.mainServer.createVersionBranchs(branchName, path, modules);
        if (rt) {
            return success<boolean>(true);
        }
        return error<boolean>(false);
    }

}
