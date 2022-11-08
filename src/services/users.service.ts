import { Request, Response } from "express";
import pca, { REDIRECT_URI } from "../config";
import SqlDriver from "../helpers/sql.helper";
import { IUser } from "../models/users.model";

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
            const account:any = response.account;
            const dn:string[] = account.username.split("edu");
            
            const ud: IUser = {
                name: account.name,
                email: account.username,
                create_at: new Date(),
                utype_id: (dn.length === 1)? 1 : 2
            };

            const sql: SqlDriver = new SqlDriver();

            sql.input("name", ud.name);
            sql.input("email", ud.email);
            sql.input("create_at", new Date());
            sql.input("utype_id", ud.utype_id);

            sql.execute("InsertUser")

            res.cookie("tk","dasdwqrwgerr trew");
            res.redirect("http://localhost:3001");

        }).catch((error:any) => {
            console.log(error);
            res.status(500).send(error);
        });
    }
};

export default UserService;