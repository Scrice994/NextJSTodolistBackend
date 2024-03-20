import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
    PORT: port(),
    SERVER_URL: str(),
    MONGO_SERVER_URL: str(),
    WEBSITE_URL: str(),
    SESSION_SECRET: str(),
    USER_MANAGEMENT_URL: str(),
    EVENT_BUS_URL: str(),
});

export default env;