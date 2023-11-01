import { TodoRepository } from "../../src/repositories/TodoRepository";
import { DataStorageMock } from "../__mocks__/dataStorage.mock";

describe("unit", () => {
    describe("TodoRepository", () => {
        const dataStorage = new DataStorageMock();
        const repository = new TodoRepository(dataStorage);

        const fakeResponse = {
            text: 'textText',
            completed: false,
            userId: 'testUserId'
        }

        describe("add()", () => {
            it("should call createEntity from dataStorage and return the result",async () => {
                dataStorage.createEntity.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const result = await repository.add({text: 'textText', userId: 'testUserId'});

                expect(result).toEqual(fakeResponse);
            });
        });

        describe("browseAll()", () => {
            it("should call findAllEntities from dataStorage and return the result",async () => {
                dataStorage.findAllEntities.mockImplementationOnce(() => Promise.resolve([fakeResponse, fakeResponse]));

                const result = await repository.browseAll({});

                expect(result).toEqual([fakeResponse, fakeResponse]);
            });
        });

        describe("browseOne()", () => {
            it("should call findOneEntityByKey from dataStorage and return the result",async () => {
                dataStorage.findOneEntityByKey.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const result = await repository.browseOne({text: "testText"});

                expect(result).toEqual(fakeResponse);
            });
        });

        describe("change()",() => {
            it("Should call updateEntity from dataStorage and return the result",async () => {
                dataStorage.updateEntity.mockImplementationOnce(() => Promise.resolve({...fakeResponse, completed: true}));

                const result = await repository.changeOne({ id: 'testUserId', completed: true });
    
                expect(result).toEqual({...fakeResponse, completed: true});
            });
        });

        describe("removeOne()", () => {
            it("Should call deleteEntity from dataStorage and return the result", async () => {
                dataStorage.deleteEntity.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const result = await repository.removeOne('testUserId');

                expect(result).toEqual(fakeResponse);
            });
        });

        describe("deleteAllEntities()", () => {
            it("Should call deleteAllEntities from dataStorage and return the result", async () => {
                dataStorage.deleteAllEntities.mockImplementationOnce(() => Promise.resolve([fakeResponse, fakeResponse]));

                const result = await repository.removeAll({id: 'testUserId'});

                expect(result).toEqual([fakeResponse, fakeResponse]);
            });
        });
    });
});