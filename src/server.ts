import mongoose from "mongoose";
import { app } from "./index";
import env from "./env";

const port = env.PORT;

mongoose.connect(env.MONGO_SERVER_URL)
.then(() => {
    console.log("Connected to Mongo Database");
    app.listen(port, () => console.log("Server running on port: " + port));
})
.catch(console.error);