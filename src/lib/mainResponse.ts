import { constant } from "./constant";


export class MainResponse<T> {
    constructor(public code: number, public data: T) { }
}

export function success<T>(data: T): MainResponse<T> {
    return new MainResponse(constant.ResponseCode.SUCCESS, data)
}

export function error<T>(data: T): MainResponse<T> {
    return new MainResponse(constant.ResponseCode.ERROR, data)
}


