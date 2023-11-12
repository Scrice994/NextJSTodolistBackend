import express from "express";
import * as UsersController from "../controllers/users";
import validateRequestSchema from "../middlewares/validateRequestSchema";
import { signUpSchema } from "../validation/users";

const router = express.Router();

router.get("/me", UsersController.getAuthenticatedUser);

router.post("/signup", validateRequestSchema(signUpSchema), UsersController.Signup);

// router.post("/reset-password-code", requestVerificationCodeRateLimit, validateRequestSchema(requestVerificationCodeSchema), UsersController.requestResetPasswordCode);

// router.post("/reset-password", va lidateRequestSchema(resetPasswordSchema), UsersController.resetPassword);

router.post("/login", UsersController.Login);

router.post("/logout", UsersController.logout);

router.get("/account-verification", UsersController.verifyUser)

export default router;