import { RequestHandler } from "express";
import { LoginBody, SignUpBody } from "../validation/users";
import { HttpClient } from "../network/httpClient";

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


export const Signup: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
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

export const Login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
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

        res.status(200).json(logoutUser.data)
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

