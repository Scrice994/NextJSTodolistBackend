import "dotenv/config";
import express from "express";
import cors from "cors";
import TodosRoutes from "./routes/todos";
import UsersRoutes from "./routes/users";
import session from "express-session";
import sessionConfig from "./config/session";
import passport from "passport";
import "./config/passport";
import errorHandler from "./middlewares/errorHandler";
import createHttpError from "http-errors";
import env from "./env";

export const app = express();

app.use(express.json());
app.use(cors({
    origin: env.WEBSITE_URL,
    credentials: true
}));
app.use(session(sessionConfig));
app.use(passport.authenticate("session"));

app.use("/todos", TodosRoutes);

app.use("/users", UsersRoutes);

app.use((req, res, next) => {next(createHttpError(404, "Endpoint not found"))});

app.use(errorHandler);


export default app;