import mongoose from "mongoose";
import { app } from "./index";
import env from "./env";

const port = env.PORT;

mongoose.connect('mongodb://127.0.0.1:27017/TodoList')
.then(() => {
    console.log("Connected to Mongo Database");
    app.listen(port, () => console.log("Server running on port: " + port));
})
.catch(console.error);