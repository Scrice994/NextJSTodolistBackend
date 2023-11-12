import createHttpError from "http-errors";
import { IEntity } from "./IEntity";

export interface UserEntity extends IEntity {
    username?: string,
    email?: string,
    password?: string,
    userRole: string,
    status?: string,
    verificationCode?: string,
    tenantId?: string,
    googleId?: string,
    githubId?: string,
    createdAt?: string,
    updatedAt?: string
}

export function isUser(obj: any): obj is UserEntity{
    if(!obj){
        throw Error("obj is not a User");
    }
    return true;
}