import { TodoEntity } from "src/models/TodoEntity";
import { IRepository } from "./IRepository";
import { IDataStorage } from "src/dataStorage/IDataStorage";
import { IEntity } from "src/models/IEntity";

export class TodoRepository implements IRepository<TodoEntity>{
    constructor(private dataStorage: IDataStorage<TodoEntity>){}

    async add(obj: Omit<TodoEntity, "id">): Promise<TodoEntity> {
        const result = await this.dataStorage.createEntity(obj);
        return result;
    }
    
    async browseAll(obj: {[key: string]: unknown}): Promise<TodoEntity[]> {
        const result = await this.dataStorage.findAllEntities(obj);
        return result;
    }

    async browseOne(obj: {[key: string]: unknown}): Promise<TodoEntity> {
        const result = await this.dataStorage.findOneEntityByKey(obj);
        return result;
    }

    async changeOne(obj: Required<IEntity> & Partial<TodoEntity>, updateTimestamps?: boolean): Promise<TodoEntity> {
        const result = await this.dataStorage.updateEntity(obj, updateTimestamps);
        return result;
    }

    async removeOne(id: string): Promise<TodoEntity> {
        const result = await this.dataStorage.deleteEntity(id);
        return result;
    }

    async removeAll(obj: { [key: string]: unknown; }): Promise<TodoEntity[]> {
        const result = await this.dataStorage.deleteAllEntities(obj);
        return result;
    }
}