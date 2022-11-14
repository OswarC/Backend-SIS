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

        this.app.route("/api/user").get(this.UserService.getMyUser);
        this.app.route("/api/users").get(this.UserService.getUsers);

        this.app.route("/api/types/user")
            .get(this.UserService.getUserTypes)
            .put(this.UserService.updateUserTypes);

        this.app.route("/api/verify/users").get(this.UserService.ValidateToken);
    };
};

export default UserController;