import express from "express";
import * as TodosController from "../controllers/todos";
import requiresAuth from "../middlewares/requiresAuth";
import validateRequestSchema from "../middlewares/validateRequestSchema";
import { createTodoSchema, updateTodoSchema } from "../validation/todos";
import { createTodoRateLimit } from "../middlewares/rate-limit";
import { isAuthorized } from "../middlewares/isAuthorized";

const router = express.Router();

router.get("/get-all-todos/:userId", requiresAuth, TodosController.getTodos);

router.post("/", requiresAuth, isAuthorized, createTodoRateLimit, validateRequestSchema(createTodoSchema),TodosController.createTodo);

router.delete("/delete-todos/:userId", requiresAuth, isAuthorized, TodosController.deleteAlltodos);

router.put("/toggle/:todoId", requiresAuth, TodosController.toggleTodo);

router.put("/update/:todoId", requiresAuth, isAuthorized, validateRequestSchema(updateTodoSchema),TodosController.updateTodo);

router.post("/create-member-todo/:userId", requiresAuth, isAuthorized, TodosController.createMemberTodo);

router.get("/:todoId", requiresAuth, TodosController.getTodo);

router.delete("/:todoId", requiresAuth, isAuthorized, TodosController.deleteTodo);

export default router;