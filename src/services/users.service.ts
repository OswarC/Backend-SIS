import { Request, Response } from "express";
import pca, { REDIRECT_URI } from "../config";

class UserService{

    public login(req:Request, res: Response){
        const authCodeUrlParameters = {
            scopes: ["user.read"],
            redirectUri: REDIRECT_URI,
        };
    
        pca.getAuthCodeUrl(authCodeUrlParameters).then((response:any) => {
            res.redirect(response);
        }).catch((error:any) => console.log(JSON.stringify(error)));
    };

    public redirect(req:Request, res: Response){
        const tokenRequest = {
            code: req.query.code,
            scopes: ["user.read"],
            redirectUri: REDIRECT_URI,
        };
    
        pca.acquireTokenByCode(tokenRequest).then((response:any) => {
            console.log("\nResponse: \n:", response);
            res.cookie("tk","dasdwqrwgerr trew");
            res.redirect("http://localhost:3001");
        }).catch((error:any) => {
            console.log(error);
            res.status(500).send(error);
        });
    }
};

export default UserService;