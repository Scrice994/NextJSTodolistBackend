import { RequestHandler } from "express";
import TodoModel from "../models/mongo/todoSchema"
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { TodoRepository } from "../repositories/TodoRepository";
import { TodoEntity } from "../models/TodoEntity";
import { TodoCRUD } from "../CRUD/TodoCRUD";
import assertIsDefined from "../utils/assertIsDefined";
import { DeleteTodoParams, UpdateTodoBody, UpdateTodoParams, todoBody } from "src/validation/todos";
import createHttpError from "http-errors";


const DATA_STORAGE = new MongoDataStorage<TodoEntity>(TodoModel);
const TODO_REPOSITORY = new TodoRepository(DATA_STORAGE);
const TODO_CRUD = new TodoCRUD(TODO_REPOSITORY);

export const getTodos: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);
        const findAllTodos = await TODO_CRUD.readAll({ userId: authenticatedUser.id });
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

        const createTodo = await TODO_CRUD.create({text, description, userId: authenticatedUser.id });

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

export const toggleTodo: RequestHandler<UpdateTodoParams, unknown, unknown, unknown> = async(req, res, next) => {
    const todoToUpdateId = req.params.todoId;
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);

        const findTodoToUpdate = await TODO_CRUD.readOne({ id: todoToUpdateId });

        if(findTodoToUpdate === null){
            throw createHttpError(404, "Resource not found");
        }

        const updatedTodo = await TODO_CRUD.updateOne({ id: todoToUpdateId, completed: !findTodoToUpdate.completed }, false);
        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
}

export const deleteTodo: RequestHandler<DeleteTodoParams, unknown, unknown, unknown> = async (req, res, next) => {
    const todoId = req.params.todoId;
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);

        const findTodoToDelete = await TODO_CRUD.readOne({ id: todoId });

        if(findTodoToDelete === null){
            throw createHttpError(404, "Resource not found");
        }

        const deletedTodo = await TODO_CRUD.deleteOne(todoId);
        res.status(200).json(deletedTodo);
    } catch (error) {
        next(error);
    }
}

export const deleteAlltodos: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);

        const deletedTodos = await TODO_CRUD.deleteAll({ userId: authenticatedUser.id });

        res.status(200).json(deletedTodos);
    } catch (error) {
        next(error);
    }
}
