import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
    PORT: port(),
    SESSION_SECRET: str(),
    SERVER_URL: str(),
    WEBSITE_URL: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    SMTP_PASSWORD: str(),
    SMTP_MAIL: str()
});

export default env;