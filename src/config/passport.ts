import passport from "passport";
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { UserRepository } from "../repositories/UserRepository";
import { UserCRUD } from "../CRUD/UserCRUD";
import UserModel from  "../models/mongo/userSchema";
import { UserEntity } from "../models/UserEntity";
import bcrypt from "bcrypt";
import env from "../env";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const DATA_STORAGE = new MongoDataStorage<UserEntity>(UserModel);
const USER_REPOSITORY = new UserRepository(DATA_STORAGE);
const USER_CRUD = new UserCRUD(USER_REPOSITORY);

//dati da mostrare nella session
passport.serializeUser((user, cb) => {
    cb(null, user.id)
});

//dati che estrarrò dalla session per l'auth degli altri endpoint
passport.deserializeUser((userId: string, cb) => {
    cb(null, { id: userId })
});

passport.use(new LocalStrategy(async (username, password, cb) => {
    try {
        
        const existingUser = await USER_CRUD.readOne({ username }, "+email +password");

        if(!existingUser || !existingUser.password){
            return cb(null, false);
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password!);

        if(!passwordMatch){
            return cb(null, false);
        }

        const user = existingUser;

        delete user.password;

        return cb(null, user);

    } catch (error) {
        cb(error);
    }
}));

passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.SERVER_URL + "/users/oauth2/redirect/google",
    scope: ["profile"], //general profile information
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        console.log("SONO IL PROFILO GOOGLE:" + JSON.stringify(profile));

        let user = await USER_CRUD.readOne({ googleId: profile.id });

        if(!user){
            user = await USER_CRUD.create({
                googleId: profile.id,
                username: profile.displayName,
                userRole: 'Admin',
                status: "Active"
            });
        }

        cb(null, user);
    } catch (error) {
        if(error instanceof Error){
            cb(error);
        } else {
            throw error;
        }
    }
}));

