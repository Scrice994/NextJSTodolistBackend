import createHttpError from "http-errors";
import { IEntity } from "src/models/IEntity";
import { TodoEntity } from "src/models/TodoEntity";
import { IRepository } from "src/repositories/IRepository";
import { ICRUD } from "./ICRUD";

export class TodoCRUD implements ICRUD<TodoEntity>{
    constructor(private repository: IRepository<TodoEntity>){}

    async create(todo: Omit<TodoEntity, "id">): Promise<TodoEntity> {

        if(!todo.text){
            throw createHttpError(400, "Missing parameter text");
        }

        if(!todo.userId){
            throw createHttpError(400, "Missing parameter userId");
        }

        const result = await this.repository.add(todo);
        return result;
    }

    async readAll(obj: {[key: string]: unknown}): Promise<TodoEntity[]> {

        const result = await this.repository.browseAll(obj);
        return result;
    }
    
    async readOne(obj: {[key: string]: unknown}): Promise<TodoEntity> {

        const result = await this.repository.browseOne(obj);
        return result;
    }

    async updateOne(obj: Required<IEntity> & Partial<TodoEntity>): Promise<TodoEntity> {

        if(!obj.id){
            throw createHttpError(400, 'Missing parameter id');
        }

        const result = await this.repository.changeOne(obj);
        return result;
    }

    async deleteOne(id: string): Promise<TodoEntity> {

        if(!id){
            throw createHttpError(400, "Missing parameter id");
        }
        
        const result = await this.repository.removeOne(id);
        return result;
    }

    async deleteAll(obj: { [key: string]: unknown; }): Promise<TodoEntity[]> {

        const result = await this.repository.removeAll(obj);
        return result;
    }

}