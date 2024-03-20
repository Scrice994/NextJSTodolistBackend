import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { TodoCRUD } from "../CRUD/TodoCRUD";
import { Producer } from "../amqp/producer";
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { TodoEntity } from "../models/TodoEntity";
import TodoModel from "../models/mongo/todoSchema";
import { HttpClient } from "../network/httpClient";
import { TodoRepository } from "../repositories/TodoRepository";
import assertIsDefined from "../utils/assertIsDefined";
import { DeleteAllTodoParams, DeleteTodoParams, DeleteTodoQueries, ToggleTodoParams, ToggleTodoQueries, UpdateTodoBody, UpdateTodoParams, todoBody } from "../validation/todos";

const httpClient = new HttpClient();
const DATA_STORAGE = new MongoDataStorage<TodoEntity>(TodoModel);
const TODO_REPOSITORY = new TodoRepository(DATA_STORAGE);
const TODO_CRUD = new TodoCRUD(TODO_REPOSITORY);
export const eventProducer = new Producer();


export const getTodos: RequestHandler = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const findAllTodos = await TODO_CRUD.readAll({ userId });
        res.status(200).json(findAllTodos);
    } catch (error) {
        next(error);
    }
}

export const getTodo: RequestHandler = async (req, res, next) => {
    const todoId = req.params.todoId;
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);
        const findTodo = await TODO_CRUD.readOne({ id: todoId });
        res.status(200).json(findTodo);
    } catch (error) {
        next(error);
    }
}

export const createTodo: RequestHandler<unknown, unknown, todoBody, unknown> = async (req, res, next) => {
    const { text, description } = req.body;
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);

        const createTodo = await TODO_CRUD.create({ text, description, userId: authenticatedUser.id });

        if(createTodo){
            const findUser = await httpClient.sendRequest("/me", {
                method: "get",
                headers: {
                    Cookie: req.headers.cookie
                }
            });

            await eventProducer.publishMessage("todo", "TodoCreated", { 
                userId: authenticatedUser.id,
                username: findUser.data.username
            });
        }
    
        res.status(200).json(createTodo);
    } catch (error) {
        next(error);
    }
}

type createMemberTodoParams = {
    userId: string
}

export const createMemberTodo: RequestHandler<createMemberTodoParams, unknown, todoBody, unknown> = async (req, res, next) => {
    const { text, description } = req.body;
    const { userId } = req.params;
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);

        const createTodo = await TODO_CRUD.create({ text, description, userId });

        if(createTodo){
            const findUser = await httpClient.sendRequest("/group/get-member/" + userId, {
                method: "get",
                headers: {
                    Cookie: req.headers.cookie
                }
            });
            await eventProducer.publishMessage("todo", "TodoCreated", { userId, username: findUser.data.username });
        }

        res.status(200).json(createTodo);
    } catch (error) {
        next(error);
    }
}

export const updateTodo: RequestHandler<UpdateTodoParams, unknown, UpdateTodoBody, unknown> = async(req, res, next) => {
    const todoToUpdateId = req.params.todoId;
    const { ...valuesToUpdate } = req.body;
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);

        const findTodoToUpdate = await TODO_CRUD.readOne({ id: todoToUpdateId });

        if(findTodoToUpdate === null){
            throw createHttpError(404, "Resource not found");
        }

        const updatedTodo = await TODO_CRUD.updateOne({ id: todoToUpdateId, ...valuesToUpdate });
        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
}

export const toggleTodo: RequestHandler<ToggleTodoParams, unknown, unknown, ToggleTodoQueries> = async(req, res, next) => {
    const todoToUpdateId = req.params.todoId;
    const authenticatedUser = req.user;
    const { userId } = req.query;
    try {
        assertIsDefined(authenticatedUser);

        const findTodoToUpdate = await TODO_CRUD.readOne({ id: todoToUpdateId });

        if(findTodoToUpdate === null){
            throw createHttpError(404, "Resource not found");
        }

        const updatedTodo = await TODO_CRUD.updateOne({ id: todoToUpdateId, completed: !findTodoToUpdate.completed }, false);

        if(updatedTodo){
            await eventProducer.publishMessage("todo", "TodoToggled", {
                userId: userId ? userId : authenticatedUser.id,
                completed: updatedTodo.completed
            });
        }
        
        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
}

export const deleteTodo: RequestHandler<DeleteTodoParams, unknown, unknown, DeleteTodoQueries> = async (req, res, next) => {
    const todoId = req.params.todoId;
    const authenticatedUser = req.user;
    const { userId } = req.query
    try {
        assertIsDefined(authenticatedUser);

        const findTodoToDelete = await TODO_CRUD.readOne({ id: todoId });

        if(findTodoToDelete === null){
            throw createHttpError(404, "Resource not found");
        }

        const deletedTodo = await TODO_CRUD.deleteOne(todoId);

        if(deletedTodo){
            await eventProducer.publishMessage("todo", "TodoDeleted", {
                userId: userId ? userId : authenticatedUser.id,
                completed: deletedTodo.completed
            });
        }

        res.status(200).json(deletedTodo);
    } catch (error) {
        next(error);
    }
}

export const deleteAlltodos: RequestHandler<DeleteAllTodoParams, unknown, unknown, unknown> = async (req, res, next) => {
    const userId = req.params.userId
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);

        const deletedTodos = await TODO_CRUD.deleteAll({ userId });

        if(deletedTodos){
            await eventProducer.publishMessage("todo", "TodoDeletedAll", { userId });
        }

        res.status(200).json(deletedTodos);
    } catch (error) {
        next(error);
    }
}
