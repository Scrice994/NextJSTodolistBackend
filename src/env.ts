import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
    PORT: port(),
    SERVER_URL: str(),
    WEBSITE_URL: str(),
    SESSION_SECRET: str(),
    USER_MANAGEMENT_URL: str()
});

export default env;