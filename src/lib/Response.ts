import { Const } from "./Const";

export class Response {


    static success(data: any): any {
        return {
            code: Const.ResponseCode.SUCCESS,
            data: data,
        };
    }

    static error(data: any): any {
        return {
            code: Const.ResponseCode.ERROR,
            data: data,
        };
    }
}