import axios, { AxiosResponse } from "axios";
import env from "../env";

export interface Request {
    method: string
    headers?: object
    body?: object
}

export interface IHttpClient<T> {
    sendRequest(url: string, request: Request): Promise<T> 
}

export class HttpClient implements IHttpClient<any>{

    async sendRequest(url: string, request: Request): Promise<AxiosResponse> {
        const result = (await axios(env.USER_MANAGEMENT_URL + url, { ...this.requestToFetch(request), withCredentials: true }));
        return result;
    }

    private requestToFetch(request: Request){
        return {
            method: request.method,
            headers: request.headers,
            data: request.body
        }
    }
}