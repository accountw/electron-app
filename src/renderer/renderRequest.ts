import { IpcRendererEvent } from "electron";
import { events } from "./events";
import { MainResponse } from "@lib/mainResponse";
import { ElMessageBox } from "element-plus";
import { constant } from "@lib/constant";

export namespace RenderRequest {

    export async function start(path: string, ...params: any[]): Promise<MainResponse<any>> {
        //异步返回...args
        let rs: MainResponse<any>
        const call = (event: IpcRendererEvent, response: MainResponse<any>) => {
            events.removeMainListener(path, call)
            rs = response;
            console.log("response", response);

        }
        events.addMainListener(path, call);
        events.dispatchToMain(path, ...params);
        return new Promise<MainResponse<any>>(res => {
            const inter = setInterval(() => {
                if (rs) {
                    clearInterval(inter);
                    res(rs);
                    if (rs.code == constant.ResponseCode.ERROR) {
                        showErrorMessage();
                    }
                }
            }, 100);
        })
    }

    export function showErrorMessage() {
        ElMessageBox.alert('程序出现错误', '警告', {
            confirmButtonText: '确认',
        })
    }
}