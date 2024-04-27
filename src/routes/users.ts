import passport from "passport";
import express from "express";
import UserController from "../controllers/Usercontroller";
import middleware from "../middleware";

class UserRouter {
    public router = express.Router({ mergeParams: true })

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.route("/register")
            .get(UserController.renderRegisterUserForm)
            .post(UserController.registerUser);

        this.router.route("/login")
            .get(UserController.renderLoginForm)
            .post(middleware.storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), UserController.loginUser);

        this.router.get("/logout", UserController.logoutUser);
    }
}

export default new UserRouter().router;