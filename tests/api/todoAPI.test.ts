import axios from "axios";
import * as testUtils from "./mongoTestUtils";

describe("unit", () => {
    describe("todoAPI", () => {

        const TODO_URL = "http://localhost:8080/todos";

        beforeAll(async () => {
           await testUtils.databaseConnection();
        });

        beforeEach(async () => {
            await testUtils.clearDB();
        });

        afterAll(async () => {
            await testUtils.clearDB();
            await testUtils.closeDatabaseConnection();
        });

        describe("getTodos", () => {
            it("Should return all todos in the db",async () => {
                const createTodo = await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'});
                const createTodo2 = await axios.post(TODO_URL, {text: 'testText2', userId: 'testUserId'});
                const findTodos = await axios.get(TODO_URL);

                expect(findTodos.status).toBe(200);
                expect(findTodos.data).toEqual({
                    response: [createTodo.data.response, createTodo2.data.response]
                })
            });
        });

        describe("createTodo", () => {
            it("should create a new Todo in the db",async () => {
                const createTodo = await axios.post(TODO_URL, {text: 'testText2', userId: 'testUserId'});

                const findTodo = await axios.get(TODO_URL);

                expect(createTodo.status).toBe(200);
                expect(createTodo.data).toEqual({
                    response: findTodo.data.response[0]
                });
            });
        });

        describe("updateTodo", () => {
            it("Should update an existing Todo in the db",async () => {
                const createTodo = await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'});

                const completeTodo = await axios.put(`${TODO_URL}/${createTodo.data.response.id}`, { completed: true });

                expect(completeTodo.status).toBe(200);
                expect(completeTodo.data.response).toEqual({ ...createTodo.data.response, completed: true, updatedAt: completeTodo.data.response.updatedAt });
            });
        });

        describe("deleteTodo", () => {
            it("Should delete the todo in the db with the given id",async () => {
                const createTodo = await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'});

                const deletedTodo = await axios.delete(`${TODO_URL}/${createTodo.data.response.id}`);

                const findTodo = await axios.get(TODO_URL);

                expect(deletedTodo.status).toBe(200);
                expect(deletedTodo.data.response).toEqual(createTodo.data.response);
                expect(findTodo.data.response).toEqual([]);
            });
        });
    });
});