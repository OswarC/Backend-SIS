import { Application } from "express";
import UserService from "../services/users.service";

class UserController{
    private UserService: UserService;
    constructor(private app: Application){
        this.UserService = new UserService();
        this.routes();
    };

    private routes(){
        this.app.route("/login").get(this.UserService.login);
        this.app.route("/redirect").get(this.UserService.redirect);
    };
};

export default UserController;