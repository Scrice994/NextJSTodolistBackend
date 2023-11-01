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
            it("Should return an obj with statusCode 200 and created Todo when runs successfully", async () => {
                repository.add.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const result = await CRUD.create({text: "testText", userId: "testUserId"});

                expect(result.statusCode).toBe(200);
                expect(result.data).toEqual({ response: fakeResponse });
            });

            it("Should return an obj with statusCode 400 and message when text parameter is missing",async () => {
                const result = await CRUD.create(JSON.parse(JSON.stringify({ userId: "testUserId" })));

                expect(result.statusCode).toBe(400);
                expect(result.data).toEqual({ message: "Missing parameter text"});
            });

            it("Should return an obj with statusCode 400 and message when userId parameter is missing",async () => {
                const result = await CRUD.create(JSON.parse(JSON.stringify({ text: "testText" })));

                expect(result.statusCode).toBe(400);
                expect(result.data).toEqual({ message: "Missing parameter userId" });
            });

            it("Should return an onj with statusCode 500 and error message when a unknown error occour",async () => {
                repository.add.mockImplementationOnce(() => { throw new Error("Test Error!") });
                const result = await CRUD.create({ text: 'textText', userId: 'testUserId' });

                expect(result.statusCode).toBe(500);
                expect(result.data).toEqual({message: 'Test Error!'});
            });
        });

        describe("readAll()", () => {
            it("Should return obj with statusCode 200 and an array of todos that match the filter when runs successfully",async () => {
                repository.browseAll.mockImplementationOnce(() => Promise.resolve([fakeResponse, fakeResponse]));

                const result = await CRUD.readAll({});

                expect(result.statusCode).toBe(200);
                expect(result.data).toEqual({ response: [fakeResponse, fakeResponse]} ); 
            });

            it("Should return an onj with statusCode 500 and error message when a unknown error occour",async () => {
                repository.browseAll.mockImplementationOnce(() => { throw new Error("Test Error!") });
                const result = await CRUD.readAll({});

                expect(result.statusCode).toBe(500);
                expect(result.data).toEqual({message: 'Test Error!'});
            });
        });

        describe("readOne()", () => {
            it("Should return an obj with statusCode 200 and a todo when runs successfully",async () => {
                repository.browseOne.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const result = await CRUD.readOne({id: 'testId'});

                expect(result.statusCode).toBe(200);
                expect(result.data).toEqual({ response: fakeResponse });
            });

            it("Should return an obj with statusCode 500 and error message when a unknown error occour",async () => {
                repository.browseOne.mockImplementationOnce(() => { throw new Error("Test Error!") });
                const result = await CRUD.readOne({id: 'testId'});

                expect(result.statusCode).toBe(500);
                expect(result.data).toEqual({message: 'Test Error!'});
            });
        });

        describe("updateOne()", () => {
            it("Should return an obj with statusCode 200 and the updatedTodo when run successfully",async () => {
                repository.changeOne.mockImplementationOnce(() => Promise.resolve({...fakeResponse, completed: true}));

                const result = await CRUD.updateOne({id: 'testUserId', completed: true});

                expect(result.statusCode).toBe(200);
                expect(result.data).toEqual({ response: { ...fakeResponse, completed: true }});
            });

            it("should return an obj with statusCode 400 and error message when an error occour",async () => {
                const result = await CRUD.updateOne(JSON.parse(JSON.stringify({completed: true})));

                expect(result.statusCode).toBe(400);
                expect(result.data).toEqual({ message: 'Missing parameter id' });
            });

            it("Should return an onj with statusCode 500 and error message when a unknown error occour",async () => {
                repository.changeOne.mockImplementationOnce(() => { throw new Error("Test Error!") });
                const result = await CRUD.updateOne({id: 'testUserId', completed: true});

                expect(result.statusCode).toBe(500);
                expect(result.data).toEqual({message: 'Test Error!'});
            });
        });

        describe("deleteOne()", () => {
            it("Should return an obj with statusCode 200 and the deletedTodo when successfully",async () => {
                repository.removeOne.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const result = await CRUD.deleteOne('testUserId');

                expect(result.statusCode).toBe(200);
                expect(result.data).toEqual({ response: fakeResponse })
            });

            it("Should retunr an obj with statusCode 400 and errorMessage when an error occour",async () => {
                const result = await CRUD.deleteOne(JSON.parse(JSON.stringify("")));

                expect(result.statusCode).toBe(400);
                expect(result.data).toEqual({ message: "Missing parameter id" })
            });

            it("Should return an onj with statusCode 500 and error message when a unknown error occour",async () => {
                repository.removeOne.mockImplementationOnce(() => { throw new Error("Test Error!") });
                const result = await CRUD.deleteOne('testUserId');

                expect(result.statusCode).toBe(500);
                expect(result.data).toEqual({message: 'Test Error!'});
            });
        });

        describe("deleteAll()", () => {
            it("Should return statusCode 200 and an array of deleted Todos when successfull",async () => {
                repository.removeAll.mockImplementationOnce(() => Promise.resolve([fakeResponse, fakeResponse]));

                const result = await CRUD.deleteAll({ id: 'testUserId' });

                expect(result.statusCode).toBe(200);
                expect(result.data).toEqual({ response: [fakeResponse, fakeResponse]});
            });

            it("Should return an onj with statusCode 500 and error message when a unknown error occour",async () => {
                repository.removeAll.mockImplementationOnce(() => { throw new Error("Test Error!") });
                const result = await CRUD.deleteAll({ id: 'testUserId' });

                expect(result.statusCode).toBe(500);
                expect(result.data).toEqual({message: 'Test Error!'});
            });
        })
    });
});