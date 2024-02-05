import { MongoDataStorage } from "../../src/dataStorage/MongoDataStorage";
import { TodoEntity } from "../../src/models/TodoEntity";
import TodoModel from "../../src/models/mongo/todoSchema";
import { clearFakeData, closeFakeConnection, connectFakeDB } from "./mongoDataStorageTestSetup";

describe("unit", () => {
    describe("MongoDataStorage", () => {

        beforeAll(async () => {
            await connectFakeDB();
        });

        beforeEach(async () => {
            await clearFakeData();
        });

        afterAll(async() => {
            await closeFakeConnection();
        });

        const TodoDataStorage = new MongoDataStorage<TodoEntity>(TodoModel);

        describe("createEntity()", () => {
            it("should return the object created in the db", async () => {
                const result = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                expect(result).toEqual({
                    ...result,
                    text: 'testText',
                    userId: 'testUserId',
                    completed: false
                });
            });
        });

        describe("FindAllEntities()", () => {
            it("should return an array of objects that are the entities that match the filter in the db",async () => {
                const createEntity = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                const createEntity2 = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                const findAllEntities = await TodoDataStorage.findAllEntities({});

                expect(findAllEntities).toEqual([createEntity, createEntity2]);
            });
        });

        describe("findOneEntityByKey()", () => {
            it("should return the first object that match the filter in the db",async () => {
                const createEntity = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                await TodoDataStorage.createEntity({
                    text: 'testText2',
                    userId: 'testUserId'
                });

                const findOneEntity = await TodoDataStorage.findOneEntityByKey({text: createEntity.text});

                expect(findOneEntity).toEqual(createEntity);
            });
        });

        describe("updateEntity()", () => {
            it("Should return the updated entity from the db",async () => {
                const createEntity = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                const updatedEntity = await TodoDataStorage.updateEntity({ id: createEntity.id, completed: true });

                expect(updatedEntity).toEqual({ ...createEntity, completed: true, updatedAt: updatedEntity.updatedAt });
            });

            it("Should return the updated entity from the db but without update UpdateAt key", async () => {
                const createEntity = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                const updatedEntity = await TodoDataStorage.updateEntity({ id: createEntity.id, completed: true }, false);

                expect(updatedEntity).toEqual({ ...createEntity, completed: true });
            });
        });

        describe("deleteEntity()", () => {
            it("Should remove the entity with the given id from the db",async () => {
                const createEntity = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                const createEntity2 = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                const deleteEntity = await TodoDataStorage.deleteEntity(createEntity2.id);
                
                const findEntities = await TodoDataStorage.findAllEntities({});

                expect(deleteEntity).toEqual(createEntity2);
                expect(findEntities).toEqual([createEntity]);
            });
        });

        describe("deleteAllEntities()", () => {
            it("Should remove all entities that match the filter from the db",async () => {
                const createEntity = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                const createEntity2 = await TodoDataStorage.createEntity({
                    text: 'testText',
                    userId: 'testUserId'
                });

                const deleteEntities = await TodoDataStorage.deleteAllEntities({userId: 'testUserId'});

                const findEntities = await TodoDataStorage.findAllEntities({});

                expect(findEntities).toEqual([]);
                expect(deleteEntities).toEqual([createEntity, createEntity2]);
            });
        });
   });
});

