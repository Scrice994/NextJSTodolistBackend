import { IEntity } from "./IEntity";

export interface TodoEntity extends IEntity{
    text: string;
    description?: string;
    completed?: boolean;
    userId: string;
    tenantId?: string;
    updatedAt?: string;
    createdAt?: string;
}