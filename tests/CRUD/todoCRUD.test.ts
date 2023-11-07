import { BadRequest } from "http-errors";
import { TodoCRUD } from "../../src/CRUD/TodoCRUD";
import { RepositoryMock } from "../__mocks__/repository.mock";

describe("unit", () => {
    describe("todoCRUD", () => {
        const repository = new RepositoryMock();
        const CRUD = new TodoCRUD(repository);

        const fakeResponse = {
            text: "testText",
            completed: false,
            userId: "testUserId"
        }

        describe("create()", () => {
            it("Should return an obj with 200 and created Todo when runs successfully", async () => {
                repository.add.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const result = await CRUD.create({text: "testText", userId: "testUserId"});

                expect(result).toEqual(fakeResponse);
            });

            it("Should return a message when text parameter is missing",async () => {
                await CRUD.create(JSON.parse(JSON.stringify({ userId: "testUserId" })))
                .catch( err => {
                    expect(err).toBeInstanceOf(BadRequest);
                    expect(err.message).toEqual("Missing parameter text");
                })
            });

            it("Should return a message when userId parameter is missing",async () => {
                await CRUD.create(JSON.parse(JSON.stringify({ text: "testText" })))
                .catch(err => {
                    expect(err).toBeInstanceOf(BadRequest);
                    expect(err.message).toEqual("Missing parameter userId");
                })
            });
        });

        describe("readAll()", () => {
            it("Should return obj with 200 and an array of todos that match the filter when runs successfully",async () => {
                repository.browseAll.mockImplementationOnce(() => Promise.resolve([fakeResponse, fakeResponse]));

                const result = await CRUD.readAll({});

                expect(result).toEqual([fakeResponse, fakeResponse]); 
            });
        });

        describe("readOne()", () => {
            it("Should return an obj with 200 and a todo when runs successfully",async () => {
                repository.browseOne.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const result = await CRUD.readOne({id: 'testId'});

                expect(result).toEqual(fakeResponse);
            });
        });

        describe("updateOne()", () => {
            it("Should return an obj with 200 and the updatedTodo when run successfully",async () => {
                repository.changeOne.mockImplementationOnce(() => Promise.resolve({...fakeResponse, completed: true}));

                const result = await CRUD.updateOne({id: 'testUserId', completed: true});

                expect(result).toEqual({ ...fakeResponse, completed: true });
            });

            it("should return an obj with 400 and error message when an error occour",async () => {
                await CRUD.updateOne(JSON.parse(JSON.stringify({completed: true})))
                .catch( err => {
                    expect(err).toBeInstanceOf(BadRequest);
                    expect(err.message).toEqual('Missing parameter id');
                })
            });
        });

        describe("deleteOne()", () => {
            it("Should return an obj with 200 and the deletedTodo when successfully",async () => {
                repository.removeOne.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const result = await CRUD.deleteOne('testUserId');

                expect(result).toEqual(fakeResponse);
            });

            it("Should retunr an obj with 400 and errorMessage when an error occour",async () => {
                await CRUD.deleteOne(JSON.parse(JSON.stringify({})))
                .catch( err => {
                    expect(err).toBeInstanceOf(BadRequest);
                    expect(err.message).toEqual("Missing parameter id")
                });
            });
        });

        describe("deleteAll()", () => {
            it("Should return 200 and an array of deleted Todos when successfull",async () => {
                repository.removeAll.mockImplementationOnce(() => Promise.resolve([fakeResponse, fakeResponse]));

                const result = await CRUD.deleteAll({ id: 'testUserId' });

                expect(result).toEqual([fakeResponse, fakeResponse]);
            });
        });
    });
});