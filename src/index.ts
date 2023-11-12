import cors from "cors";
import "dotenv/config";
import express from "express";
import createHttpError from "http-errors";
import env from "./env";
import errorHandler from "./middlewares/errorHandler";
import TodosRoutes from "./routes/todos";
import UsersRoutes from "./routes/users";

export const app = express();

app.use(express.json());
app.use(cors({
    origin: env.WEBSITE_URL,
    credentials: true
}));

app.use("/todos", TodosRoutes);

app.use("/users", UsersRoutes);

app.use((req, res, next) => {next(createHttpError(404, "Endpoint not found"))});

app.use(errorHandler);


export default app;