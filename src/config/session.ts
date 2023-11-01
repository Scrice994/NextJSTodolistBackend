import { SessionOptions } from "express-session";
import MongoStore from "connect-mongo";
import env from "../env";
import crypto from "crypto";


const sessionConfig: SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, //one week,
    },
    rolling: true, //se il cookie continua a fare richieste l'age viene aggiornata
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/TodoList'
    }),
    genid(req) {
        const userId = req.user?.id;
        const randomId = crypto.randomUUID();
        if(userId){
            return `${userId}-${randomId}`;
        } else {
            return randomId;
        }
    },
}

export default sessionConfig;