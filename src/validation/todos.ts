import * as yup from "yup";

const todoBodySchema = yup.object({
    text: yup.string().required(),
    description: yup.string()
});

export type todoBody = yup.InferType<typeof todoBodySchema>;

export const createTodoSchema = yup.object({
    body: todoBodySchema
});

export const updateTodoSchema = yup.object({
    params: yup.object({
        todoId: yup.string().required()
    }),
    body: yup.object({
        text: yup.string(),
        description: yup.string(),
        completed: yup.boolean()
    })
});

export type UpdateTodoParams = yup.InferType<typeof updateTodoSchema>["params"]

export type UpdateTodoBody = yup.InferType<typeof updateTodoSchema>["body"]

export const deleteTodoSchema = yup.object({
    params: yup.object({
        todoId: yup.string().required()
    })
});

export type DeleteTodoParams = yup.InferType<typeof deleteTodoSchema>["params"]