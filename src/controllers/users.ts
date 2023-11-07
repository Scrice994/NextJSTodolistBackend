import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import * as uuid from 'uuid';
import { UserCRUD } from "../../src/CRUD/UserCRUD";
import { MongoDataStorage } from "../../src/dataStorage/MongoDataStorage";
import { UserEntity } from "../../src/models/UserEntity";
import { UserRepository } from "../../src/repositories/UserRepository";
import UserModel from "../models/mongo/userSchema";
import assertIsDefined from "../utils/assertIsDefined";
import * as Email from "../utils/email";
import { LoginBody, SignUpBody, VerificationCodeParams } from "../validation/users";

const DATA_STORAGE = new MongoDataStorage<UserEntity>(UserModel);
const USER_REPOSITORY = new UserRepository(DATA_STORAGE);
const USER_CRUD = new UserCRUD(USER_REPOSITORY);


//da testare
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.user;

    try {
        assertIsDefined(authenticatedUser);

        const getUser = await USER_CRUD.readOne({ id: authenticatedUser.id });
        res.status(200).json(getUser)
    } catch (error) {
        next(error);
    }

}

export const getUsers: RequestHandler = async (req, res, next) => {
    try {
        const findAllUsers = await USER_CRUD.readAll({});
        res.status(200).json(findAllUsers);
    } catch (error) {
        next(error);
    }
}

export const Signup: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { username, email, password: passwordRaw, tenantId } = req.body;

    try {
        const findExistingUsername = await USER_CRUD.readOne({ username });
    
        if(findExistingUsername){
            throw createHttpError(409, "Username already taken");
        }

        const findExistingEmail = await USER_CRUD.readOne({ email });

        if(findExistingEmail){
            throw createHttpError(409, "A user with this email address already exists. Please log in instead");
        }

        const verificationCode = uuid.v4();

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);
    
        const newUser = await USER_CRUD.create({
            username,
            email,
            password: passwordHashed,
            tenantId,
            userRole: 'Admin',
            verificationCode
        })
        
        delete newUser.password;

        await Email.sendVerificationEmail(username, email, verificationCode);
    
        res.status(200).json(newUser);
    } catch (error) {
        next(error);
    }
}

export const Login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const { username } = req.body
    try {
        const findUser = await USER_CRUD.readOne({ username });

        if(findUser.status !== "Active" || !findUser.status){
            throw createHttpError(401, "Pending account. Please verify your email")
        }


        res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
}

export const verifyUser: RequestHandler<VerificationCodeParams, unknown, unknown, unknown> = async (req, res, next) => {
    const { verificationCode } = req.params;

    try {
        const verificationCodeUser = await USER_CRUD.readOne({ verificationCode });

        if(!verificationCodeUser){
            throw createHttpError(404, "User not found");
        }

        const switchUserToActive = await USER_CRUD.updateOne({ id: verificationCodeUser.id, status: "Active" }); 

        res.status(200).json(switchUserToActive);
    } catch (error) {
        next(error);
    }
}

//da testare
export const logOut: RequestHandler = (req, res) => {
    req.logout(error => {
        if(error) throw error;
    });
    req.session.destroy(function (error) {
        if (!error) {
            res.clearCookie('connect.sid', {path: '/'}).sendStatus(200);
        } else {
            throw error;
        }
    });
}

// export const requestResetPasswordCode: RequestHandler<unknown, unknown, requestVerificationCodeBody, unknown> = async (req, res, next) => {
//     const { email } = req.body
//     try {
//         const user = await USER_CRUD.readOne({ email });

//         if(!user){
//             throw createHttpError(404, "A user with this email doesn't exist. Please sign up instead.");
//         }

//         const verificationCode = crypto.randomInt(100000, 999999).toString();

//         await PasswordResetToken.create({ email, verificationCode });

//         await Email.sendPasswordResetCode(email, verificationCode);

//         res.sendStatus(200);
//     } catch (error) {
//         next(error);
//     }
// }

// export const resetPassword: RequestHandler<unknown, unknown, ResetPasswordBody, unknown> = async (req, res, next) => {
//     const { email, password: newPasswordRaw, verificationCode } = req.body;

//     try {
//         const existingUser = await USER_CRUD.readOne({ email },"+email");

//         if(existingUser === null){
//             throw createHttpError(404, "User not found");
//         }

//         const passwordResetToken = await PasswordResetToken.findOne({ email, verificationCode });

//         if(!passwordResetToken){
//             throw createHttpError(400, "Verification code incorrect or expired");
//         } else {
//             await passwordResetToken.deleteOne();
//         }

//         await destroyAllActiveSessionsForUser(existingUser.id.toString());

//         const newPasswordHashed = await bcrypt.hash(newPasswordRaw, 10);

//         const saveUserNewPassword = await USER_CRUD.updateOne({ id: existingUser.id, password: newPasswordHashed });

//         req.logIn(saveUserNewPassword, error => {
//             if(error) throw error;
//             res.status(200).json(saveUserNewPassword);
//         })
//     } catch (error) {
//         next(error);
//     }
// }
