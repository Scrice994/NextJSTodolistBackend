import express from "express";
import * as TodosController from "../controllers/todos";
import requiresAuth from "../middlewares/requiresAuth";
import validateRequestSchema from "../middlewares/validateRequestSchema";
import { createTodoSchema, updateTodoSchema } from "../validation/todos";
import { createTodoRateLimit } from "../middlewares/rate-limit";

const router = express.Router();

router.get("/", requiresAuth, TodosController.getTodos);

router.post("/", requiresAuth, createTodoRateLimit, validateRequestSchema(createTodoSchema),TodosController.createTodo);

router.delete("/delete-todos", requiresAuth, TodosController.deleteAlltodos);

router.get("/:todoId", requiresAuth, TodosController.getTodo);

router.put("/toggle/:todoId", requiresAuth, TodosController.toggleTodo);

router.put("/update/:todoId", requiresAuth, validateRequestSchema(updateTodoSchema),TodosController.updateTodo);

router.delete("/:todoId", requiresAuth, TodosController.deleteTodo);

export default router;