import axios from "axios";
import * as testUtils from "./utils/mongoTestUtils";

describe("unit", () => {
    describe("todoAPI", () => {

        const TODO_URL = "http://localhost:8080/todos";
        const USER_URL = "http://localhost:8080/users";
        const testUserCredentials = {
            username: "testUsername", 
            password: "testPassword",
        }

        beforeEach(async () => {
            await testUtils.clearDB();
        });

        describe("getTodos", () => {
            it("Should return all todos in the db",async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);
                
                const createTodo = await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const createTodo2 = await axios.post(TODO_URL, {text: 'testText2', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const findTodos = await axios.get(TODO_URL, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(findTodos.status).toBe(200);
                expect(findTodos.data).toEqual([createTodo.data, createTodo2.data]);
            });
        });

        describe("createTodo", () => {
            it("should return the new todo",async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, {text: 'testText2', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const findTodo = await axios.get(TODO_URL, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(createTodo.status).toBe(200);
                expect(createTodo.data).toEqual(findTodo.data[0]);
            });
        });

        describe("updateTodo", () => {
            it("Should update an existing Todo in the db",async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const completeTodo = await axios.put(`${TODO_URL}/update/${createTodo.data.id}`, { completed: true, text: "updatedText" }, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(completeTodo.status).toBe(200);
                expect(completeTodo.data).toEqual({ ...createTodo.data, completed: true, text: "updatedText", updatedAt: completeTodo.data.updatedAt });
            });

            it("should return error when given todo id don't match any todo in the db", async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const completeTodo = await axios.put(`${TODO_URL}/update/${"testTodoId"}`, { completed: true, text: "updatedText" }, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                })
                .catch( err => {
                    expect(err.response.status).toBe(404);
                    expect(err.response.data).toEqual({ error: "Resource not found" });
                })

                expect(completeTodo).toBeUndefined();
            });
        });

        describe.only("toggleTodo", () => {
            it("Should return a todo with the completed key updated", async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const completeTodo = await axios.put(`${TODO_URL}/toggle/${createTodo.data.id}`, {}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(completeTodo.status).toBe(200);
                expect(completeTodo.data).toEqual({ ...createTodo.data, completed: true });
            });
        });

        describe("deleteTodo", () => {
            it("Should delete the todo in the db with the given id",async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const deletedTodo = await axios.delete(`${TODO_URL}/${createTodo.data.id}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const findTodo = await axios.get(TODO_URL, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(deletedTodo.status).toBe(200);
                expect(deletedTodo.data).toEqual(createTodo.data);
                expect(findTodo.data).toEqual([]);
            });

            it("should return error when given todo id don't match any todo in the db", async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const deletedTodo = await axios.delete(`${TODO_URL}/${"testTodoId"}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                })
                .catch( err => {
                    expect(err.response.status).toBe(404);
                    expect(err.response.data).toEqual({ error: "Resource not found" });
                })

                expect(deletedTodo).toBeUndefined();
            });
        });

        describe("deleteAllTodos", () => {
            it("Should delete all todos in the db with the given userId",async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, {text: 'testText', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const createTodo2 = await axios.post(TODO_URL, {text: 'testText2', userId: 'testUserId'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const deleteAllTodos = await axios.delete(`${TODO_URL}/delete-todos`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const findTodos = await axios.get(TODO_URL, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(deleteAllTodos.status).toBe(200);
                expect(deleteAllTodos.data).toEqual([createTodo.data, createTodo2.data]);
                expect(findTodos.data).toEqual([]);
            });
        });
    });
});


