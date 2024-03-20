import express from "express";
import * as UsersController from "../controllers/users";

const router = express.Router();

router.get("/me", UsersController.getAuthenticatedUser);

router.post("/signup", UsersController.Signup);

router.post("/login", UsersController.login);

router.get("/login/google", UsersController.loginGoogle);

router.post("/logout", UsersController.logout);

router.get("/account-verification", UsersController.verifyUser);

router.post("/group/create-member-account", UsersController.createNewGroupMember);

router.get("/group/get-members", UsersController.getMembers);

router.put("/change-username", UsersController.changeUsername);

export default router;