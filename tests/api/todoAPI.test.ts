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
        const testMemberCredentials = {
            username: "testMemberUsername", 
            password: "testPassword",
        }

        beforeEach(async () => {
            await testUtils.clearDB();
        });

        describe("getTodos", () => {
            it("Should return all todos in the db",async () => {
                const activeUser = await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);
                
                const createTodo = await axios.post(TODO_URL, { text: 'testText' }, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const createTodo2 = await axios.post(TODO_URL, { text: 'testText2' }, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const findTodos = await axios.get(TODO_URL + `/get-all-todos/${activeUser.id}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(findTodos.status).toBe(200);
                expect(findTodos.data).toEqual([createTodo.data, createTodo2.data]);
            });
        });

        describe("getTodo", () => {
            it("Should return a todo with the given Id", async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);
                
                const createTodo = await axios.post(TODO_URL, {text: 'testText' }, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const findTodo = await axios.get(TODO_URL + `/${createTodo.data.id}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(findTodo.status).toBe(200);
                expect(findTodo.data).toEqual(createTodo.data);
            })
        })

        describe("createTodo", () => {
            it("should return the new todo",async () => {
                const activeUser = await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, { text: 'testText2' }, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const findTodo = await axios.get(TODO_URL + `/get-all-todos/${activeUser.id}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(createTodo.status).toBe(200);
                expect(createTodo.data).toEqual(findTodo.data[0]);
            });

            it("should fail when user is not an Admin", async () => {
                const activeUser = await testUtils.initializeMemberAccount();

                const logIn = await axios.post(USER_URL + "/login", testMemberCredentials);

                const createTodo = await axios.post(TODO_URL, {text: 'testText2'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                }).catch( err => {
                    expect(err.response.status).toBe(403);
                    expect(err.response.data).toEqual({ error: "You are not authorized" });
                });

                expect(createTodo).toBeUndefined();
            });
        });

        describe("createMemberTodo", () => {
            it("Should create a todo for the member with provided userId",async () => {
                await testUtils.initializeActiveAccount();
                const member = await testUtils.initializeMemberAccount();

                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const todoForMember = await axios.post(`${TODO_URL}/create-member-todo/${member.id}`, { text: "testText" }, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const loginMember = await axios.post(USER_URL + "/login", testMemberCredentials);

                const findMemberTodos = await axios.get(TODO_URL + `/get-all-todos/${member.id}`, {
                    headers: {
                        Cookie: loginMember.headers["set-cookie"]
                    }
                });

                expect(findMemberTodos.data).toEqual([todoForMember.data]);
            });
        });

        describe("updateTodo", () => {
            it("Should update an existing Todo in the db",async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, { text: 'testText' }, {
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

                await axios.post(TODO_URL, { text: 'testText' }, {
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

            it("Should return 403 error when a user member try to update a todo", async () => {
                await testUtils.initializeMemberAccount();
                const logIn = await axios.post(USER_URL + "/login", testMemberCredentials);

                const updatedTodo = await axios.put(`${TODO_URL}/update/${"testTodoId"}`, { text: "updatedText" }, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                })
                .catch( err => {
                    expect(err.response.status).toBe(403);
                    expect(err.response.data).toEqual({ error: "You are not authorized" });
                })

                expect(updatedTodo).toBeUndefined();
            });
        });

        describe("toggleTodo", () => {
            it("Should return a todo with the completed key updated", async () => {
                await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, { text: 'testText' }, {
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
                const activeUser = await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, { text: 'testText' }, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const deletedTodo = await axios.delete(`${TODO_URL}/${createTodo.data.id}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const findTodo = await axios.get(TODO_URL + `/get-all-todos/${activeUser.id}`, {
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

                await axios.post(TODO_URL, {text: 'testText' }, {
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

            it("should return 403 error when a user member try to delete a todo", async () => {
                const activeMember = await testUtils.initializeMemberAccount();
                const logIn = await axios.post(USER_URL + "/login", testMemberCredentials);

                const deletedTodo = await axios.delete(`${TODO_URL}/${"testTodoId"}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                })
                .catch( err => {
                    expect(err.response.status).toBe(403);
                    expect(err.response.data).toEqual({ error: "You are not authorized" });
                })

                expect(deletedTodo).toBeUndefined();
            });
        });

        describe("deleteAllTodos", () => {
            it("Should delete all todos in the db with the given userId",async () => {
                const activeUser = await testUtils.initializeActiveAccount();
                const logIn = await axios.post(USER_URL + "/login", testUserCredentials);

                const createTodo = await axios.post(TODO_URL, {text: 'testText'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const createTodo2 = await axios.post(TODO_URL, {text: 'testText2'}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const deleteAllTodos = await axios.delete(`${TODO_URL}/delete-todos/${activeUser.id}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                const findTodos = await axios.get(TODO_URL + `/get-all-todos/${activeUser.id}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(deleteAllTodos.status).toBe(200);
                expect(deleteAllTodos.data).toEqual([createTodo.data, createTodo2.data]);
                expect(findTodos.data).toEqual([]);
            });

            it("Should return error when a user member try to delete all todos", async () => {
                const activeUser = await testUtils.initializeMemberAccount();

                const logIn = await axios.post(USER_URL + "/login", testMemberCredentials);

                const deleteAllTodos = await axios.delete(`${TODO_URL}/delete-todos/${activeUser.id}`, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                })
                .catch( err => {
                    expect(err.response.status).toBe(403);
                    expect(err.response.data).toEqual({ error: "You are not authorized" });
                });

                expect(deleteAllTodos).toBeUndefined();
            })
        });
    });
});


