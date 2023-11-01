import express from "express";
import * as UsersController from "../controllers/users";
import passport from "passport";
import requiresAuth from "../middlewares/requiresAuth";
import validateRequestSchema from "../middlewares/validateRequestSchema";
import { loginSchema, resetPasswordSchema, signUpSchema } from "../validation/users";
import env from "../env";
import { loginRateLimit, requestVerificationCodeRateLimit } from "../middlewares/rate-limit";

const router = express.Router();

router.get("/", UsersController.getUsers);

router.get("/me", requiresAuth, UsersController.getAuthenticatedUser);

router.post("/signup", validateRequestSchema(signUpSchema), UsersController.Signup);

// router.post("/reset-password-code", requestVerificationCodeRateLimit, validateRequestSchema(requestVerificationCodeSchema), UsersController.requestResetPasswordCode);

// router.post("/reset-password", validateRequestSchema(resetPasswordSchema), UsersController.resetPassword);

router.post("/login", loginRateLimit, passport.authenticate('local'), validateRequestSchema(loginSchema), UsersController.Login);

router.get("/login/google", passport.authenticate('google'));

router.get("/oauth2/redirect/google", passport.authenticate('google', {
    successRedirect: env.WEBSITE_URL + "/todolist",
    failureRedirect : env.WEBSITE_URL + 'authentication/login',
    keepSessionInfo: true
}));

router.post("/logout", UsersController.logOut);

router.get("/account-verification/:verificationCode", UsersController.verifyUser)

export default router;