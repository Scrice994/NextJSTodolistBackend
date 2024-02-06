import { RequestHandler } from "express";
import { HttpClient } from "../network/httpClient";
import env from "../env";

const httpClient = new HttpClient()


export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const getUser = await httpClient.sendRequest("/me", {
            method: "get",
            headers: {
                Cookie: req.headers.cookie
            }
        });

        res.status(getUser.status).json(getUser.data);
    } catch (error) {
        next(error);
    }
}

export const Signup: RequestHandler = async (req, res, next) => {
    try {
        const createUser = await httpClient.sendRequest("/signup", {
            method: "post",
            body: req.body
        });

        res.status(createUser.status).json(createUser.data);
    } catch (error) {
        next(error);
    }
}

export const login: RequestHandler = async (req, res, next) => {
    try {
        const logUser = await httpClient.sendRequest("/login", {
            method: "post",
            body: req.body
        });

        const cookie = logUser.headers["set-cookie"];

        res.status(logUser.status).header("Set-Cookie", cookie).json(logUser.data);
    } catch (error) {
        next(error);
    }
}

export const logout: RequestHandler = async (req, res, next) => {
    try {
        const logoutUser = await httpClient.sendRequest("/logout", {
            method: "post",
            headers: {
                Cookie: req.headers.cookie
            }
        });

        res.status(200).clearCookie("connect.sid", { path: "/"}).json(logoutUser.data)
    } catch (error) {
        next(error);
    }
}

interface AccountVerificationQueryParams{
    userId: string
    verificationCode: string
}

export const verifyUser: RequestHandler<unknown, unknown, unknown, AccountVerificationQueryParams> = async (req, res, next) => {
    const { userId, verificationCode } = req.query;

    try {
        const getVerification = await httpClient.sendRequest(`/account-verification?userId=${userId}&verificationCode=${verificationCode}`, {
            method: "get",
        });

        res.status(200).json(getVerification.data);
    } catch (error) {
        next(error);
    }
}

export const createNewGroupMember: RequestHandler = async (req, res, next) => {
    try {
        const createUser = await httpClient.sendRequest("/group/create-member-account", {
            method: "post",
            headers: { Cookie: req.headers.cookie },
            body: req.body
        });

        res.status(200).json(createUser.data);
    } catch (error) {
        next(error);
    }
}

export const changeUsername: RequestHandler = async (req, res, next) => {
    try {
        const updatedUser = await httpClient.sendRequest("/change-username", {
            method: "put",
            headers: { Cookie: req.headers.cookie },
            body: req.body
        });

        res.status(200).json(updatedUser.data);
    } catch (error) {
        next(error)
    }
}

export const loginGoogle: RequestHandler = async (req, res, next) => {
    try {
        res.redirect(env.USER_MANAGEMENT_URL + "/login/google");
    } catch (error) {
        next(error);
    }
}
